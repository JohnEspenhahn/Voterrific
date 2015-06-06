'use strict';

var fs = require('fs'),
	path = require('path');

// Load errors from json
var ERRORS = JSON.parse(fs.readFileSync(path.resolve('./public/modules/errors/data/errors.json'), 'utf8'));

// Expose
module.exports = {
	get: function(code) {
		if (ERRORS[code]) return code;
		else throw new Error('Invalid error code "' + code + '"');
	},
	
	getByJSON: function(req, res) {
		var code = req.query.code;
		if (ERRORS[code]) return res.json({ key: code, value: ERRORS[code] });
		else return res.set(400).send(new Error('Invalid error code "' + code + '"'));
	}
};