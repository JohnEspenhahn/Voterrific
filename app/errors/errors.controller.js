'use strict';

var fs = require('fs'),
	path = require('path');

var ERRORS = JSON.parse(fs.readFileSync(path.resolve('./public/modules/errors/data/errors.json'), 'utf8'));

module.exports = {
	get: function(code) {
		if (ERRORS[code]) return code;
		else throw new Error('Invalid error code "' + code + '"');
	}
};