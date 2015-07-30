'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	errors = require('../../controllers/ErrorsController.server.js'),
	config = require('../ConfigController.server.js');

// Strategy callback is the same for Facebook, Google, and linkedin
function callback(provider) {
	return function(req, accessToken, refreshToken, profile, done) {
		
		process.nextTick(function() {
			// Compile user profile
			var providerUserProfile = {
				displayName: (profile.displayName || profile.firstName + ' ' + profile.lastName),
				providers: { }
			};
			providerUserProfile.providers[provider] = (profile._json.id || profile.id);
			
			// Save the user OAuth profile
			var searchQuery = {};
			searchQuery['providers.' + provider] = providerUserProfile.providers[provider];
			
			if (!req.user) {
				// If not already logged in, then login
				User.findOne(searchQuery, function(err, user) {
					if (err) {
						return done(err);
					} else if (!user) {
						user = new User(providerUserProfile);

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				});
			} else {
				// User is already logged in, join the provider data to the existing user
				var user = req.user;

				// If not signed in on this provider
				if (!user.providers[provider]) {
					// Check if another user is signed in with this provider
					User.findOne(searchQuery, function(err, otherUser) {
						if (err) {
							return done(err, null, '/');
						} else if (!otherUser) {
							// Not yet linked to a user, so link it to this user
							user.providers[provider] = providerUserProfile.providers[provider];
							user.markModified('providers'); // Tell mongoose that we've updated the field

							user.save(function(err) {
								return done(err, user, '/');
							});
						} else {
							// Already linked to another user
							return done(null, user, '/?error=' + errors.get('linked_other'));
						}
					});
				} else {
					// Already linked to this
					return done(null, user, '/?error=' + errors.get('linked_this'));
				}
			}

		});

	};
}

// The configuring function to be called when loaded
module.exports = function(app, passport) {
	passport.serializeUser(function(user, done) {
		console.log('Serializing');
		console.log(user);
		done(null, (user._id || user.id)); 
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new GoogleStrategy({	
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
		}, callback('google')
	));

	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.consumerKey,
			consumerSecret: config.twitter.consumerSecret,
			callbackURL: config.twitter.callbackURL
		}, callback('twitter')
	));

	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			passReqToCallback: true
		}, callback('facebook')
	));

	passport.use(new LinkedInStrategy({
			clientID: config.linkedin.clientID,
    		clientSecret: config.linkedin.clientSecret,
	    	callbackURL: config.linkedin.callbackURL,
	    	state: true
		}, callback('linkedin')
	));

};