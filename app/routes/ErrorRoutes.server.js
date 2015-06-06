'use strict';

var ErrorsController = require('../controllers/ErrorsController.server.js');

module.exports = function(app) {
	
	// Get errors api
	app.get('/errors', ErrorsController.getByJSON);
	
};