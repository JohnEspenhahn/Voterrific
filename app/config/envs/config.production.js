'use strict';

module.exports = {
	secure: true,

	log: {
		folder: (process.env.OPENSHIFT_LOG_DIR || './logs')
	},

	sessionCookie: {
		secure: true
	},

	jsResources: [
		'/dist/app.min.js',
		'/modules/appTemplates.js'
	]
};