'use strict';

var wintson = require('winston'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RepSchema = new Schema({
	bioguide_id: { type: String },
	transparencydata_id: { type: String },

	name: { type: String, required: true },
	party: { type: String, enum: [ 'D', 'R', 'I' ], required: true },
	term: { type: String },
	chamber: { type: String, required: true },
	district: { type: String },

	photo_url: { type: String },
	contact_url: { type: String },
	phone: { type: String },

	// DEBUG
	funds: { type: Number, default: 100000 }
});

RepSchema.index( { bioguide_id: 1, transparencydata_id: 1 } , { unique: true } );

/**
 * Attempt to save this representative if it is unique
 * Call the given callback with the proper id or error
 * @param {function(Object, ObjectId)} The callback
 */
RepSchema.methods.saveUnique = function(callback) {
	var _this = this;
    mongoose.model('Rep').findOne({ $and: [ {'bioguide_id': this.bioguide_id}, {'transparencydata_id': this.transparencydata_id} ] }, function (err, doc) {
    	if (err) {
    		callback(err);
        } else if (doc) {
        	callback(null, doc._id);
        } else {
        	_this.save(function(err) {
	    		if (err) {
	    			callback(err);
	    		} else {
	    			callback(null, _this._id);
	    		}
	    	});
        }
    });
};

mongoose.model('Rep', RepSchema);