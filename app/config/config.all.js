'use strict';

module.exports = {
	uri : process.env.OPENSHIFT_NODEJS_IP || 'localhost',
	port : process.env.OPENSHIFT_NODEJS_PORT || 80,

	db : {
		uri : 'mongodb://' + (process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost') + ':' + (process.env.OPENSHIFT_MONGODB_DB_PORT || '27017') + '/voter',
		options : {
			user : 'site',
			pass : 'f21Adfv9o'
		}
	},
	
	log : {
		mode : 'tiny'
	},

	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: '0ns5df@#sadfA12',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null,
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',

	google : {
		clientID : process.env.GOOGLE_ID || '237066238200-n2c2o4lbhv69qgj9hdmhv1i49mu7ug0j.apps.googleusercontent.com',
		clientSecret : process.env.GOOGLE_SECRET || 'TKcw9ePM0Yn_EfE53qbYCz-c',
		callbackURL : '/auth/google/callback'
	},
	facebook : {
		clientID : process.env.FACEBOOK_ID || '1415470705444429',
		clientSecret : process.env.FACEBOOK_SECRET || 'de6ab9b117ae679904119eaa1b73af02',
		callbackURL : '/auth/facebook/callback'
	},
	
	cssResources : [
		'/lib/bootstrap/dist/css/bootstrap.css',
		'/lib/bootstrap/dist/css/bootstrap-theme.min.css',
		'/css/**/*.css'
	],
	
	jsResources : [
		'/lib/angular/angular.js',
		'/lib/angular-route/angular-route.min.js',
		'/lib/angular-animate/angular-animate.js',
		'/lib/angular-touch/angular-touch.js',
		'/lib/angular-bootstrap/ui-bootstrap-tpls.js',
		'/modules/**/*.js'
	]
};
