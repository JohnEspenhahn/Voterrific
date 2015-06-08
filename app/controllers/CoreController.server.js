'use strict';

var path = require('path'),
	mongoose = require('mongoose'),
	AccordionRow = mongoose.model('AccordionRow'),
	Alert = mongoose.model('Alert');

module.exports = {
	
	// Get rows from database
	getRows: function(req, res) {
		AccordionRow.find({}, function(err, rows) {
			if (err) return res.set(400).send(err);
			res.json(rows);
		});
	},
	
	// Get alerts from database
	getAlerts: function(req, res) {
		Alert.find({}, function(err, alerts) {
			if (err) return res.set(400).send(err);
			res.json(alerts);
		});
	}
	
};