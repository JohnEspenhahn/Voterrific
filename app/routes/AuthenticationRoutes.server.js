'use strict';

var AuthenticationController = require('../controllers/AuthenticationController.server.js');

module.exports = function(app, passport) {	
	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [ 'https://www.googleapis.com/auth/userinfo.profile' ]
	}));
	app.route('/auth/google/callback').get(AuthenticationController.oauthCallback('google'));

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', { }));
	app.route('/auth/facebook/callback').get(AuthenticationController.oauthCallback('facebook'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin', { }));
	app.route('/auth/linkedin/callback').get(AuthenticationController.oauthCallback('linkedin'));

	app.get('/auth/logout', AuthenticationController.logout);
};