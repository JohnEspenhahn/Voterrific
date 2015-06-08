'use strict';

var express = require('express'),
	app = express(),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	glob = require('glob'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	chalk = require('chalk'),
	ejs = require('ejs'),
	flash = require('flash'),
	config = require('./app/config/ConfigController.server.js');

// Bootstrap db connection
mongoose.connect(config.db.uri, config.db.options, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});
mongoose.connection.on('error', function(err) {
	console.error(chalk.red('MongoDB connection error: ' + err));
	process.exit(-1);
});

// Setup app
app.set('view engine', 'ejs');
app.use(morgan(config.log.mode)); // log every request to the console
app.use(cookieParser());
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

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./bower_components')));

// Load models
var modelFiles = glob.sync('./app/models/**/*.js');
for (var i = 0; i < modelFiles.length; i++) { require(modelFiles[i]); }

// Load routers	
var routeFiles = glob.sync('./app/routes/**/*.js');
for (var i = 0; i < routeFiles.length; i++) { require(routeFiles[i])(app); }

// Single index file
app.get('*', function(req, res) {
	console.log(chalk.yellow('User: ' + req.user));
	
	res.render(path.resolve('./public/index.ejs'), { user: req.user });
});

// Load names of resources
app.locals.jsResources = config.getJSResources();
app.locals.cssResources = config.getCSSResources();

// Start app
app.listen(config.port, config.uri);

console.log(chalk.green('Running at ' + config.uri + ':' + config.port));
console.log('--');

// expose app           
exports = module.exports = app; 
