'use strict';

var path = require('path'),
	mongoose = require('mongoose'),
	AccordionRow = mongoose.model('AccordionRow');

module.exports = function(app) {
	
	// Single index file
	app.get('/', function(req, res) {
		res.render(path.resolve('./public/index.ejs'));
	});
	
	// Get accordion rows from the database
	app.get('/rows/', function(req, res) {
		AccordionRow.find({}, function(err, rows) {
			if (err) return res.set(400).send(err);
			res.json(rows);
		});
	});
};