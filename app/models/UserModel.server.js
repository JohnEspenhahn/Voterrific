'use strict';

require('./RepModel.server.js');

var winston = require('winston'),
	mongoose = require('mongoose'),
	Rep = mongoose.model('Rep'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;
	
var UserSchema = new Schema({	
	displayName: {
		type: String,
		required: 'Please fill in a display name',
		trim: true
	},
	
	/** Login providers */
	providers: { },

	/** Voterrific representatives */
	representatives: {
		house: ObjectId,
		senate_junior: ObjectId,
		senate_senior: ObjectId,

		state_lower: ObjectId,
		state_upper: ObjectId
	}
});

/** 
 * Check that he given object (or default this.representatives)
 * has all the representatives loaded
 * @return {Boolean}
 */
UserSchema.methods.hasRepresentatives = function(reps) {
	reps = reps || this.representatives;
	return reps.house && reps.senate_junior && reps.senate_senior && reps.state_lower && reps.state_upper;
};

/**
 *
 * Get the representatives objects for this user then calls
 * the callback passing the obects as a parameter
 * @param {function(Object)} callback The function to call
 */
UserSchema.methods.getRepresentatives = function(callback) {
	var fields = Object.keys(this.representatives),
		reps = { };

	for(var i = 0; i < fields.length; i++) {
		if (typeof this.representatives[fields[i]] !== 'function') {
			winston.info('Loading representative ' + fields[i]);
		    this.getRepresentative(fields[i], reps, callback);
		}
	}
};

/**
 * Get the representative of type field and save it in reps
 * @param {String} field The field name of the representative to get
 * @param {Object} reps The object to store the loaded representative in
 * @param {function(Object)} callback the function to call on completion
 * 
 * On error reps.error will be set to true. The result will synchronously
 * be stored in reps[field] on success.
 *
 * Upon loading all the representatives or error, calls the callback
 */
UserSchema.methods.getRepresentative = function(field, reps, callback) {
	var _this = this;
	Rep.findById(this.representatives[field], function(err, rep) {
		if (err) reps.error = true;
		else reps[field] = rep;

		if (reps.error || _this.hasRepresentatives(reps)) callback(reps);
	});
};

mongoose.model('User', UserSchema);