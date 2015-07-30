'use strict';

module.exports = {
	google : {
		callbackURL : 'http://127.0.0.1/auth/google/callback'
	},
	twitter : {
		callbackURL : 'http://127.0.0.1/auth/twitter/callback'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1415548538769979',
		clientSecret: process.env.FACEBOOK_SECRET || 'f2c46a8907b9b1a75cfa1e3e4bce4c0d',
		callbackURL: 'http://localhost/auth/facebook/callback'
	},
	linkedin : {
		callbackURL : 'http://127.0.0.1/auth/linkedin/callback'
	},

	jsResources: [
		'/modules/*.js',
		'/modules/*/*.js',
		'/modules/*/*/**/*.js'
	]
};