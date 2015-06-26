'use strict';

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	glob = require('glob'),
	winston = require('winston'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	ejs = require('ejs'),
	flash = require('flash'),
	config = require('./app/config/ConfigController.server.js');

// Bootstrap db connection
mongoose.connect(config.db.uri, config.db.options, function(err) {
	if (err) {
		winston.error('Could not connect to MongoDB!');
		winston.error(err);
	}
});
mongoose.connection.on('error', function(err) {
	winston.error('MongoDB connection error: ' + err);
	process.exit(-1);
});

// Setup log
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { 
	colorize: true, 
	leve: 'debug',
	handleExceptions: true,
	humanReadableUnhandledException: true
});
winston.add(winston.transports.File, { 
	filename: config.log.folder + '/' + config.log.default,
	prettyPrint: true,
	json: false

});
winston.handleExceptions(new winston.transports.File({ 
	filename: config.log.folder + '/' + config.log.exceptions,
	humanReadableUnhandledException: true,
	handleExceptions: true,
	json: false,
	colorize: true
}));

// Setup app
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// Express MongoDB session storage
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: config.sessionSecret,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: config.sessionCookie
}));

app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./bower_components')));

// Load models
var modelFiles = glob.sync('./app/models/**/*.js');
for (var i = 0; i < modelFiles.length; i++) { require(modelFiles[i]); }

// Load routers	
var routeFiles = glob.sync('./app/routes/**/*.js');
for (var i = 0; i < routeFiles.length; i++) { require(routeFiles[i])(app); }

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session


// Single index file route
app.get('*', function(req, res) {
	if (config.secure && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.hostname, req.url].join(''));
    }
	
	res.render(path.resolve('./public/index.ejs'), { user: req.user });
});

// Load names of resources
app.locals.jsResources = config.getJSResources();
app.locals.cssResources = config.getCSSResources();

// Start app
app.listen(config.port, config.uri);

winston.info('Logging to directory ' + config.log.folder);
winston.info('Running at ' + config.uri + ':' + config.port);
winston.info('--');

// expose app           
exports = module.exports = app; 
