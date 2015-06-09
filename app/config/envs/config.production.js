'use strict';

module.exports = {
	log: {
		folder: (process.env.OPENSHIFT_LOG_DIR || './logs')
	},

	jsResources: [
		'/dist/app.min.js'
	]
};