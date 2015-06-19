'use strict';

var path = require('path'),
	request = require('request'),
	winston = require('winston'),
	mongoose = require('mongoose'),
	Row = mongoose.model('Row'),
	User = mongoose.model('User'),
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
		res.json([]);
	} else {
		res.json([ new Row({
			type: 'LocationSetup',
			isOpen: true,
			isClosable: false
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

	request('http://openstates.org/api/v1/legislators/geo/?lat=' + lat + '&long=' + lng + '&apikey=' + config.sunlight.apiKey,
		function(err, sunlightRes, body) {
			if (!err && sunlightRes.statusCode === 200) {
				body = JSON.parse(body);
				for (var key in body) {
					var rep = body[key];

					req.user.districts.state = rep.state;
					if (rep.chamber === 'upper') {
						req.user.representatives.state_lower = rep;
						req.user.districts.state_lower = rep.district;
					} else if (rep.chamber === 'lower') {
						req.user.representatives.state_upper = rep;
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

	request('https://congress.api.sunlightfoundation.com/legislators/locate?latitude=' + lat + '&longitude=' + lng + '&apikey=' + config.sunlight.apiKey,
		function(err, sunlightRes, body) {
			if (!err && sunlightRes.statusCode === 200) {
				body = JSON.parse(body);
				if (body.count === 3) {
					for (var key in body.results) {
						var rep = body.results[key];

						if (rep.chamber === 'house') {
							req.user.representatives.house = rep;
							req.user.districts.house = rep.district;
						} else if (rep.state_rank === 'junior') {
							req.user.representatives.senate_junior = rep;
						} else if (rep.state_rank === 'senior') {
							req.user.representatives.senate_senior = rep;
						}
					}

					doneLoading();
					return;
				} else {
					winston.error('Expected 3 results from congress api, but got ' + body.count);
				}
			}

			// If got here an error occured
			winston.error('An error occured while loading congress');
			onError(res);
		}
	);

	function doneLoading() {
		if (!res.headersSent && req.user.hasDistricts()) {
			// Save updated user if not temp
			if (!req.user.providers.temp) {
				req.user.markModified('representatives');
				req.user.markModified('districts');

				req.user.save(function(err) {
					if (err) winston.error('Failed to save updated user after loading districts');
				});
			}

			// Send representatives
			res.json( req.user.representatives );
			res.end();
		}
	}
};

exports.loadDistrictsWithAddress = function(req, res) {
	request('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(req.params.address) + '&key=' + config.google.apiKey,
		function(err, googleRes, body) {
			if (!err && googleRes.statusCode === 200) {
				body = JSON.parse(body);
				if (body.status === 'OK') {
					req.params.lat = body.results[0].geometry.location.lat;
					req.params.lng = body.results[0].geometry.location.lng;

					exports.loadDistricts(req, res);
					return;
				}
			}

			// If got here an error occured
			winston.error('An error occured while geocoding ' + req.params.address);
			onError(res);
		}
	);
};