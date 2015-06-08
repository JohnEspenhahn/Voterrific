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
	isCloseable: {
		type: Boolean,
		default: true
	},
	header: { },
	body: { }
});

mongoose.model('AccordionRow', AccordionRowSchema);
