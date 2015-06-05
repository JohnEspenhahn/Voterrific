'use strict';

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	glob = require('glob'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
	ejs = require('ejs'),
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
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

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
