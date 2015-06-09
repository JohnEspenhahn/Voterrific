'use strict';

var glob = require('glob'),
	winston = require('winston');

var config = require('./envs/config.all.js');

if (!process.env.NODE_ENV) {
	winston.warn('No NODE_ENV provided, defaulting to "dev"');
	process.env.NODE_ENV = 'dev';
} else {
	winston.info('Running with NODE_ENV ' + process.env.NODE_ENV);
}

function mergeConfig(configA, configB) {
	for (var key in configA) {
		if (configB[key]) {
			if (configA[key] instanceof Array) { // combine arrays
				configA[key] = configA[key].concat(configB[key]);
			} else if (configA[key] instanceof Object) {
				mergeConfig(configA[key], configB[key]);
			} else { // replace everything else
				configA[key] = configB[key];
			}
		}
	}
}
mergeConfig(config, require('./envs/config.' + process.env.NODE_ENV + '.js'));

config.getCSSResources = function() {
	var resources = [];
	for (var i = 0; i < this.cssResources.length; i++) {
		var name = './public' + this.cssResources[i],
			files = glob.sync(name);
		
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
		
		for (var j = 0; j < files.length; j++) {
			var file = files[j].substr(8);
			
			resources.push(file);
		}
	}
	
	return resources;
};

module.exports = config;