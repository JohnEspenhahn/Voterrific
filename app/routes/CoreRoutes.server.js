'use strict';

var CoreController = require('../controllers/CoreController.server.js');

module.exports = function(app) {
	
	// Get accordion rows from the database
	app.get('/rows', CoreController.getRows);
	
};