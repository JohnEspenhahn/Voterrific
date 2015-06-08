'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AccordionRowSchema = new Schema({
	type: {
		type: String,
		required: true
	},
	isOpen: {
		type: Boolean,
		default: false
	},
	header: { },
	body: { }
});

mongoose.model('AccordionRow', AccordionRowSchema);
