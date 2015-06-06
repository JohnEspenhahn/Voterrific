'use strict';

var express = require('express'),
	app = express(),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	path = require('path'),
	glob = require('glob'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	MongoStore = require('connect-mongo')(session),
	chalk = require('chalk'),
	ejs = require('ejs'),
	flash = require('flash'),
	config = require('./app/config/controller.js');

// Bootstrap db connection
var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
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
	saveUninitialized: true,
	resave: true,
	secret: config.sessionSecret,
	db: new MongoStore({
		mongooseConnection: mongoose.connection,
		collection: config.sessionCollection
	}),
	cookie: config.sessionCookie,
	name: config.sessionName
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./bower_components')));

// Load models
glob('./app/models/**/*.js', function(err, files) {
	if (err) {
		console.error(chalk.red('Load models error: ' + err));
		process.exit(-1);
	}
	
	for (var i = 0; i < files.length; i++) {
		console.log(chalk.gray('Loading model ' + files[i]));
		require(path.resolve(files[i]));
	}
});

// Load controllers
glob('./app/controllers/**/*.js', function(err, files) {
	if (err) {
		console.error(chalk.red('Load controllers error: ' + err));
		process.exit(-1);
	}
	
	for (var i = 0; i < files.length; i++) {
		console.log(chalk.gray('Loading controller ' + files[i]));
		(require(path.resolve(files[i])))(app);
	}
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
