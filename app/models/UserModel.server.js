'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var UserSchema = new Schema({
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

		state: String,
		state_lower: String,
		state_upper: String
	},

	/** Voterrific representatives (temp) */
	representatives: {
		house: Object,
		senate_junior: Object,
		senate_senior: Object,

		state_lower: Object,
		state_upper: Object
	}
});

UserSchema.methods.hasDistricts = function() {
	var dist = this.districts;
	return dist.house && dist.state && dist.state_lower && dist.state_upper;
};

mongoose.model('User', UserSchema);