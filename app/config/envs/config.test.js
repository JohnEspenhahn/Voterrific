'use strict';

module.exports = {
	secure: false,

	google : {
		callbackURL : '/auth/google/callback'
	},
	facebook: {
		callbackURL: '/auth/facebook/callback'
	},
	twitter : {
		callbackURL : '/auth/twitter/callback'
	},
	linkedin : {
		callbackURL : 'auth/linkedin/callback'
	},

	log: {
		folder: (process.env.OPENSHIFT_LOG_DIR || './logs')
	},

	sessionCookie: {
		secure: false
	},

	jsResources: [
		'/dist/app.min.js',
		'/modules/appTemplates.js'
	]
};