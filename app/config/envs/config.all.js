'use strict';

module.exports = {
	secure: false,
	uri : process.env.IP || process.env.OPENSHIFT_NODEJS_IP || 'localhost',
	port : process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 80,

	db : {
		uri : 'mongodb://' + (process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost') + ':' + (process.env.OPENSHIFT_MONGODB_DB_PORT || '27017') + '/voter',
		options : {
			user : 'site',
			pass : 'f21Adfv9o'
		}
	},
	
	log : {
		folder: './logs',
		default: 'voterrific.log',
		exceptions: 'exceptions.log'
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
		maxAge: null
	},

	google : {
		apiKey: 'AIzaSyD0d7h9MKnvO8J_aWUO1PdJP4hntSzRWfA',
		clientID : process.env.GOOGLE_ID || '237066238200-n2c2o4lbhv69qgj9hdmhv1i49mu7ug0j.apps.googleusercontent.com',
		clientSecret : process.env.GOOGLE_SECRET || 'TKcw9ePM0Yn_EfE53qbYCz-c',
		callbackURL : 'https://voter-rific.rhcloud.com/auth/google/callback'
	},
	facebook : {
		clientID : process.env.FACEBOOK_ID || '1415470705444429',
		clientSecret : process.env.FACEBOOK_SECRET || 'de6ab9b117ae679904119eaa1b73af02',
		callbackURL : 'https://voter-rific.rhcloud.com/auth/facebook/callback'
	},
	twitter : {
		consumerKey : '7vv2mkofkQ48rMIVnLGqQZXUt',
		consumerSecret : 'POySCRoVr6V1ATOOpFp3I7bL7ODkpK6oWvRjZ3ahFJWbvWpHmE',
		callbackURL : 'https://voter-rific.rhcloud.com/auth/twitter/callback'
	},
	linkedin : {
		clientID : '75vx8i9ltastcm',
		clientSecret : 'njbee2bqrNrwNJBu',
		callbackURL : 'https://voter-rific.rhcloud.com/auth/linkedin/callback'
	},
	sunlight : {
		apiKey: 'bee89768caac44f9bfd80b41cb8e262c'
	},
	
	cssResources : [
		'/lib/bootstrap/dist/css/bootstrap.css',
		'/lib/bootstrap/dist/css/bootstrap-theme.min.css',
		'/lib/font-awesome/css/font-awesome.min.css',
		'/css/**/*.css'
	],
	
	jsResources : [
		'/lib/angular/angular.js',
		'/lib/angular-route/angular-route.min.js',
		'/lib/angular-animate/angular-animate.js',
		'/lib/angular-touch/angular-touch.js',
		'/lib/angular-sanitize/angular-sanitize.min.js',
		'/lib/ngstorage/ngStorage.min.js',
		'/lib/hammerjs/hammer.min.js',
		'/lib/ryanmullins-angular-hammer/angular.hammer.min.js',
		'/lib/lodash/lodash.min.js',
		'/lib/angular-google-maps/dist/angular-google-maps.min.js',
		'/lib/angular-bootstrap/ui-bootstrap-tpls.js'
	]
};
