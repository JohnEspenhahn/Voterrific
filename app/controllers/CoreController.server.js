'use strict';

var path = require('path'),
	mongoose = require('mongoose'),
	Row = mongoose.model('Row');

module.exports = {
	
	// Get rows from database
	getRows: function(req, res) {
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
	},

	loadDistricts: function(req, res) {
		console.log('Loading distrcts at ' + req.params.lat + 'x' + req.params.lng);
		res.end();
	},

	loadDistrictsWithAddress: function(req, res) {
		console.log('Loading districts at address ' + req.params.address);
		res.end();
	}
	
};