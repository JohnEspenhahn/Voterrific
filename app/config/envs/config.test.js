'use strict';

module.exports = {
	secure: false,

	log: {
		folder: (process.env.OPENSHIFT_LOG_DIR || './logs')
	},

	sessionCookie: {
		httpOnly: true,
		secure: false
	},

	jsResources: [
		'/dist/app.min.js',
		'/modules/appTemplates.js'
	]
};