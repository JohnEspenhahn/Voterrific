'use strict';

module.exports = {
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1415548538769979',
		clientSecret: process.env.FACEBOOK_SECRET || 'f2c46a8907b9b1a75cfa1e3e4bce4c0d',
		callbackURL: '/auth/facebook/callback'
	},
	jsResources: [
		'/modules/**/*.js'
	]
};