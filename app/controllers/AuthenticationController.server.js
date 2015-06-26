'use strict';

var mongoose = require('mongoose'),
	winston = require('winston'),
	User = mongoose.model('User'),
	passport = require('passport'),
	errors = require('./ErrorsController.server.js');
	
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// Login using the specified strategy
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		console.log('Authenticating ' + strategy);

		passport.authenticate(strategy, function(err, user, redirectURL) {
			console.log('In authenticating ' + strategy);

			if (err || !user) {
				winston.info('Auth error: ' + err);
				return res.redirect('/?error=' + errors.get('login_failed'));
			}
			req.login(user, function(err) {
				if (err) {
					winston.info('Login error: ' + err);
					return res.redirect('/?error=' + errors.get('login_failed'));
				}

				console.log('Authentication success!');
				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

// Save the profile loaded by either Facebook or Google
exports.saveOAuthUserProfile = function(req, provider, providerUserProfile, done) {
	var searchQuery = {};
	searchQuery['providers.' + provider] = providerUserProfile.providers[provider];
	
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
};

exports.logout = function(req, res){
	req.logout();
	res.set(200).json({ success: true });
};

// Helper function
exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
};