'use strict';

var CoreController = require('../controllers/CoreController.server.js');

module.exports = function(app) {
	
	// Get accordion rows from the database
	app.get('/rows', CoreController.getRows);

	// Load representatives for a user at the given lat, lng
	app.get('/loadRepresentatives/:lat/:lng', CoreController.loadRepresentatives);

	// Load campaign finance funds for a given representative
	app.get('/loadFunds/:repId', CoreController.loadFunds);
};