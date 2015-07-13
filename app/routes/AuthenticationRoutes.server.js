'use strict';

var winston = require('winston'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
	config = require('../config/ConfigController.server.js');

// Sessions before loading AuthenticationController	
passport.serializeUser(function(user, done) { 
	done(null, user._id); 
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// Then load controller
var AuthenticationController = require('../controllers/AuthenticationController.server.js')

// Strategy callback is the same for Facebook and Google
function callback(provider) {
	return function(req, accessToken, refreshToken, profile, done) {
		var providerUserProfile = {
			displayName: (profile.displayName || profile.firstName + ' ' + profile.lastName),
			providers: { }
		};
		
		providerUserProfile.providers[provider] = (profile._json.id || profile.id);
		
		// Save the user OAuth profile
		AuthenticationController.saveOAuthUserProfile(req, provider, providerUserProfile, done);
	};
}

module.exports = function(app) {	
	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [ 'https://www.googleapis.com/auth/userinfo.profile' ]
	}));
	app.route('/auth/google/callback').get(AuthenticationController.oauthCallback('google'));
	
	passport.use(new GoogleStrategy({	
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
		}, callback('google')
	));

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', { }));
	app.route('/auth/facebook/callback').get(AuthenticationController.oauthCallback('facebook'));

	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			passReqToCallback: true
		}, callback('facebook')
	));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin', { }));
	app.route('/auth/linkedin/callback').get(AuthenticationController.oauthCallback('linkedin'));

	passport.use(new LinkedInStrategy({
			clientID: config.linkedin.clientID,
    		clientSecret: config.linkedin.clientSecret,
	    	callbackURL: config.linkedin.callbackURL,
	    	state: true
		}, callback('linkedin')
	));

	app.get('/auth/logout', AuthenticationController.logout);
};