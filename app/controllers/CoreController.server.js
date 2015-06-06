'use strict';

var path = require('path'),
	mongoose = require('mongoose'),
	AccordionRow = mongoose.model('AccordionRow'),
	chalk = require('chalk');

module.exports = function(app) {
	
	// Get accordion rows from the database
	app.get('/rows', function(req, res) {
		AccordionRow.find({}, function(err, rows) {
			if (err) return res.set(400).send(err);
			res.json(rows);
		});
	});
	
	// Single index file
	app.get('*', function(req, res) {
		console.log(chalk.yellow('User: ' + req.user));
		
		res.render(path.resolve('./public/index.ejs'), {
			user: req.user
		});
	});
	
};