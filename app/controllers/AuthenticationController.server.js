'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../config/config.controller'),
	errors = require('../errors/errors.controller');
	
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});
	
// Save the profile loaded by either Facebook or Google
function savefgOAuthUserProfile(req, provider, providerUserProfile, done) {
	var searchQuery = {};
	searchQuery['providers.' + provider] = providerUserProfile.providerId;
	
	if (!req.user) {
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
}
	
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
		savefgOAuthUserProfile(req, provider, providerUserProfile, done);
	};
}

// Login using the specified strategy
function oauthCallback(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				console.log('Error: ' + err + ' or no user');
				return res.redirect('/?error=' + errors.get('login_failed'));
			}
			req.login(user, function(err) {
				if (err) {
					console.log('Error: ' + err);
					return res.redirect('/?error=' + errors.get('login_failed'));
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
}

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
	
module.exports = function(app) {	
	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(oauthCallback('facebook'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(oauthCallback('google'));
	
	app.get('/auth/logout', function(req, res){
		req.logout();
		res.set(200).json({ success: true });
	});
	
	// Helper function
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/');
	}
};