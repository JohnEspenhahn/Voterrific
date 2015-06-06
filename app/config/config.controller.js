'use strict';

var glob = require('glob'),
	chalk = require('chalk');

var config = require('./envs/config.all.js');

if (!process.env.NODE_ENV) {
	console.log(chalk.red('No NODE_ENV provided, defaulting to "dev"'));
	process.env.NODE_ENV = 'dev';
}

var envConfig = require('./envs/config.' + process.env.NODE_ENV + '.js');
for (var key in envConfig) config[key] = envConfig[key];

config.getCSSResources = function() {
	var resources = [];
	for (var i = 0; i < this.cssResources.length; i++) {
		var name = './public' + this.cssResources[i],
			files = glob.sync(name);
		
		console.log(chalk.gray('CSS files: ' + files));
		
		for (var j = 0; j < files.length; j++) {
			var file = files[j].substr(8);
			
			resources.push(file);
		}
	}
	
	return resources;
};

config.getJSResources = function() {
	var resources = [];
	for (var i = 0; i < this.jsResources.length; i++) {
		var name = './public' + this.jsResources[i],
			files = glob.sync(name);
		
		console.log(chalk.gray('JS files: ' + files));
		
		for (var j = 0; j < files.length; j++) {
			var file = files[j].substr(8);
			
			resources.push(file);
		}
	}
	
	return resources;
};

module.exports = config;