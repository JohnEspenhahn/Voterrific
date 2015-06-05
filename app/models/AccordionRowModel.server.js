'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AccordionRowSchema = new Schema({
	title : String,
	body : String
});

mongoose.model('AccordionRow', AccordionRowSchema);
