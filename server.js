'use strict';

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	glob = require('glob'),
	winston = require('winston'),
	fs = require('fs'),
	flash    = require('connect-flash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	ejs = require('ejs'),
	config = require('./app/config/ConfigController.server.js');

// Setup log
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { 
	colorize: true, 
	level: 'debug',
	handleExceptions: true,
	humanReadableUnhandledException: true
});
winston.add(winston.transports.File, {
	level: 'debug',
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

// Load models
var modelFiles = glob.sync('./app/models/**/*.js');
for (var i = 0; i < modelFiles.length; i++) { require(modelFiles[i]); }

// Load tools config (ex: passport config)
var toolsFiles = glob.sync('./app/config/tools/**/*.js');
for (var i = 0; i < toolsFiles.length; i++) { require(toolsFiles[i])(app, passport); }

// Setup app
app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./bower_components')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.set('view engine', 'ejs');

// trust first proxy (for secure)
app.set('trust proxy', 1);

// Express MongoDB session storage
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: config.sessionSecret,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: config.sessionCookie
}));

// Passport session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Load routers
var routeFiles = glob.sync('./app/routes/**/*.js');
for (var i = 0; i < routeFiles.length; i++) { require(routeFiles[i])(app, passport); }

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
