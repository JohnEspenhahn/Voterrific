'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var UserModel = new Schema({
	/*
	email: {
		type: String,
		trim: true,
		required: 'Please fill in your email',
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	*/
	
	displayName: {
		type: String,
		required: 'Please fill in a display name',
		trim: true
	},
	
	/** Login providers */
	providers: { },
	
	/** Voterrific districts */
	districts: {
		house: String,
		senate: String,
		state_lower: String,
		state_upper: String
	}
});

mongoose.model('User', UserModel);