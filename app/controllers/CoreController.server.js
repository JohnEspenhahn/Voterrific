'use strict';

var path = require('path'),
	request = require('request'),
	winston = require('winston'),
	mongoose = require('mongoose'),
	Row = mongoose.model('Row'),
	User = mongoose.model('User'),
	Rep = mongoose.model('Rep'),
	RepScrubber = require('./scrubbers/RepScrubber.server.js'),
	Errors = require('./ErrorsController.server.js'),
	config = require('./../config/ConfigController.server.js');

// Get rows from database
exports.getRows = function(req, res) {
	if (req.user && req.user.hasRepresentatives()) {
		exports.loadRepresentatives(req, res);
	} else {
		res.json([ new Row({
			type: 'LocationSetup',
			isOpen: true,
			noHeader: true
		}) ]);
	}
};

/** 
 * On error while trying to load
 * @param {Reponse} res The reponse object
 */
function onError(res) {
	if (!res.headersSent) {
		res.json( { error: true } );
		res.end();
	}
}

/**
 * Called to check if done loading
 * @param {User} user THe user to save for
 * @param {Response} res The reponse object
 */
function doneLoading(user, res) {
	if (!res.headersSent && user.hasRepresentatives()) {
		// Save updated user if not temp
		if (!user.providers.temp) {
			user.markModified('representatives');

			winston.info('Saving');
			user.save(function(err) {
				if (err) winston.error('Failed to save updated user after loading');
			});
		}

		// Send representatives
		var reps = user.getRepresentatives(function(reps) {
			if (reps.error) {
				onError(res);
			} else {
				res.json([
					new Row({ type: 'Rep', content: reps.senate_senior }),
					new Row({ type: 'Rep', content: reps.senate_junior }),
					new Row({ type: 'Rep', content: reps.house }),
					new Row({ type: 'Rep', content: reps.state_upper }),
					new Row({ type: 'Rep', content: reps.state_lower })
				]);
				res.end();
			}
		});

		return true;
	} else {
		return false;
	}
}

/** 
 * Properly save the given representative
 * @param {User} user The user to save for
 * @param {Response} res The response object
 * @param {String} field The field name of the representative
 * @param {Rep} rep The representative
 */
function saveRep(user, res, field, rep) {
	var next = doneLoading;

	rep.saveUnique(function(err, id) {
		if (err) {
			winston.error('Failed to save representative after loading.');
			winston.error(err);
			onError(res);
		} else {
			user.representatives[field] = id;
			next(user, res, field, rep);
		}
	});
}

/**
 * Load the funds the representative has. Does NOT handle invalid rep.transparencydata_id
 * @param {User} user The user to save for
 * @param {Response} res The response object
 * @param {String} field The field name of the representative
 * @param {Rep} rep The representative
 */
function doLoadFunds(user, res, field, rep) {
	var next = saveRep;

	if (!rep.transparencydata_id) {
		winston.debug('No transparencydata_id for representative ' + rep.name);

		next(user, res, field, rep);
	} else {
		var url = 'http://transparencydata.com/api/1.0/aggregates/pol/' + rep.transparencydata_id + '/contributors/type_breakdown.json?apikey=' + config.sunlight.apiKey;
		console.log(url);	
		request(url,
			function(err, transparencydataRes, body) {
				if (!err && transparencydataRes.statusCode === 200) {
					body = JSON.parse(body);

					console.log(body);
					rep.contributors = body;
					rep.markModified('contributors');
				} else {
					winston.error('An error occured while loading funds');
				}

				next(user, res, field, rep);
			}
		);
	}
}

/**
 * Load the funds the representative has. Handles invalid rep.transparencydata_id
 * @param {User} user The user to save for
 * @param {Response} res The response object
 * @param {String} field The field name of the representative
 * @param {Rep} rep The representative
 */
function loadFunds(user, res, field, rep) {
	var next = doLoadFunds;

	if (!rep.transparencydata_id && rep.bioguide_id) {
		request('http://transparencydata.org/api/1.0/entities/id_lookup.json?&bioguide_id=' + rep.bioguide_id + '&apikey=' + config.sunlight.apiKey,
			function(err, transparencydataRes, body) {
				if (!err && transparencydataRes.statusCode === 200) {
					body = JSON.parse(body);

					if (body.length === 0) {
						winston.error('No results found while searching politician by bioguide_id: ' + rep.bioguide_id);
					} else {
						rep.transparencydata_id = body[0].id;
					}
				} else {
					winston.error('An error occured while searching politician by name');
				}

				next(user, res, field, rep);
			}
		);
	} else {
		next(user, res, field, rep);
	}
}

/** 
 * Load districts at a given latitude and longitude
 * :lat
 * :lng
 */
exports.loadRepresentatives = function(req, res) {
	var lat = req.params.lat,
		lng = req.params.lng,
		next = loadFunds;

	if (!req.user) req.user = new User({ displayName: '', providers: { temp: 1 } });

	// Check if already loaded
	var preloaded = doneLoading(req.user, res);
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
					if (rep.chamber === 'upper') {
						next(req.user, res, 'state_upper', RepScrubber.scrub('openstates', rep));
					} else if (rep.chamber === 'lower') {
						next(req.user, res, 'state_lower', RepScrubber.scrub('openstates', rep));
					}
				}
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
							next(req.user, res, 'house', RepScrubber.scrub('congress', rep));
						} else if (rep.state_rank === 'junior') {
							next(req.user, res, 'senate_junior', RepScrubber.scrub('congress', rep));
						} else if (rep.state_rank === 'senior') {
							next(req.user, res, 'senate_senior', RepScrubber.scrub('congress', rep));
						}
					}
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

/** 
 * Load funds for a given representative
 * :repId The id of the representative on our server
 */
exports.loadFunds = function(req, res) {
	res.json({ funds: 0 });
};