'use strict';

var winston = require('winston'),
	passport = require('passport'),
	errors = require('./ErrorsController.server.js');

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

exports.logout = function(req, res){
	req.logout();
	res.set(200).json({ success: true });
};

// Helper function
exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
};