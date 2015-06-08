'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AlertSchema = new Schema({
	type: {
		type: String,
		required: true
	},
	text: String
});

mongoose.model('Alert', AlertSchema);
