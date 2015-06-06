'use strict';

var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../config/ConfigController.server.js'),
	AuthenticationController = require('../controllers/AuthenticationController.server.js');
	
// Strategy callback is the same for Facebook and Google
function fgStrategyCallback(provider) {
	return function(req, accessToken, refreshToken, profile, done) {
		var providerUserProfile = {
			displayName: profile.displayName,
			email: profile.emails[0].value,
			providers: { }
		};
		
		providerUserProfile.providers[provider] = profile._json.id;
		
		// Save the user OAuth profile
		AuthenticationController.savefgOAuthUserProfile(req, provider, providerUserProfile, done);
	};
}
	
module.exports = function(app) {	
	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(AuthenticationController.oauthCallback('facebook'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(AuthenticationController.oauthCallback('google'));
	
	app.get('/auth/logout', AuthenticationController.logout);
	
	// Set up Google strategy
	passport.use(new GoogleStrategy({	
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
		}, fgStrategyCallback('google')
	));

	// Set up Facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			passReqToCallback: true
		}, fgStrategyCallback('facebook')
	));
};