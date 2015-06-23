'use strict';

var path = require('path'),
	request = require('request'),
	winston = require('winston'),
	mongoose = require('mongoose'),
	Row = mongoose.model('Row'),
	User = mongoose.model('User'),
	RepScrubber = require('./scrubbers/RepScrubber.server.js'),
	Errors = require('./ErrorsController.server.js'),
	config = require('./../config/ConfigController.server.js');

function onError(res) {
	if (!res.headersSent) {
		res.json( { error: true } );
		res.end();
	}
}

// Get rows from database
exports.getRows = function(req, res) {
	if (req.user && req.user.hasDistricts()) {
		exports.loadDistricts(req, res);
	} else {
		res.json([ new Row({
			type: 'LocationSetup',
			isOpen: true,
			isCloseable: false
		}) ]);
	}

	/*
	Row.find({}, function(err, rows) {
		if (err) return res.set(400).send(err);
		res.json(rows);
	});
	*/
};

exports.loadDistricts = function(req, res) {
	var lat = req.params.lat,
		lng = req.params.lng;

	if (!req.user) req.user = new User({ displayName: '', providers: { temp: 1 } });

	// Called to check if done loading
	var doneLoading = function() {
		if (!res.headersSent && req.user.hasDistricts()) {
			// Save updated user if not temp
			if (!req.user.providers.temp) {
				req.user.markModified('representatives');
				req.user.markModified('districts');

				winston.info('Saving');
				req.user.save(function(err) {
					if (err) winston.error('Failed to save updated user after loading districts');
				});
			}

			// Send representatives
			var rows = [ 
				new Row({ type: 'Rep', content: req.user.representatives.senate_senior }),
				new Row({ type: 'Rep', content: req.user.representatives.senate_junior }),
				new Row({ type: 'Rep', content: req.user.representatives.house }),
				new Row({ type: 'Rep', content: req.user.representatives.state_upper }),
				new Row({ type: 'Rep', content: req.user.representatives.state_lower })
			];

			res.json( rows );
			res.end();

			return true;
		} else {
			return false;
		}
	};

	// Check if already loaded
	var preloaded = doneLoading();
	if (preloaded) return;

	// Get state data
	var url = 'http://openstates.org/api/v1/legislators/geo/?lat=' + lat + '&long=' + lng + '&apikey=' + config.sunlight.apiKey;
	console.log(url);
	request(url,
		function(err, sunlightRes, body) {
			if (!err && sunlightRes.statusCode === 200) {
				body = JSON.parse(body);
				for (var key in body) {
					var rep = body[key];

					req.user.districts.state = rep.state;
					if (rep.chamber === 'upper') {
						req.user.representatives.state_lower = RepScrubber.scrub('openstates', rep);
						req.user.districts.state_lower = rep.district;
					} else if (rep.chamber === 'lower') {
						req.user.representatives.state_upper = RepScrubber.scrub('openstates', rep);
						req.user.districts.state_upper = rep.district;
					}
				}

				doneLoading();
				return;
			}
			
			winston.error('An error occured while loading state');
			onError(res);
		}
	);

	// Get national congress
	url = 'http://congress.api.sunlightfoundation.com/legislators/locate?latitude=' + lat + '&longitude=' + lng + '&apikey=' + config.sunlight.apiKey;
	console.log(url);
	request(url,
		function(err, sunlightRes, body) {
			if (!err) {
				body = JSON.parse(body);
				if (body.count === 3) {
					for (var key in body.results) {
						var rep = body.results[key];

						if (rep.chamber === 'house') {
							req.user.representatives.house = RepScrubber.scrub('congress', rep);
							req.user.districts.house = rep.district;
						} else if (rep.state_rank === 'junior') {
							req.user.representatives.senate_junior = RepScrubber.scrub('congress', rep);
						} else if (rep.state_rank === 'senior') {
							req.user.representatives.senate_senior = RepScrubber.scrub('congress', rep);
						}
					}

					doneLoading();
					return;
				} else {
					winston.error('Expected 3 results from congress api, but got ' + body.count);
				}
			}

			// If got here an error occured
			winston.error('An error occured while loading congress. ' + err);
			onError(res);
		}
	);
};