'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RowSchema = new Schema({
	type: {
		type: String,
		required: true
	},
	isOpen: {
		type: Boolean,
		default: false
	},
	noHeader: {
		type: Boolean,
		default: false
	},
	isAlert: {
		type: Boolean,
		default: false
	},
	content: { }
});

mongoose.model('Row', RowSchema);
