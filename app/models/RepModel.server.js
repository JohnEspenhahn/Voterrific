'user strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RepSchema = new Schema({
	bioguide_id: { type: String },
	transparencydata_id: { type: String },

	name: { type: String, required: true },
	party: { type: String, enum: [ 'D', 'R', 'I' ], required: true },
	term: { type: String },
	// gender: { type: String, enum: [ 'M', 'F', 'O' ], required: true },
	chamber: { type: String, required: true },
	district: { type: String },

	photo_url: { type: String },
	contact_url: { type: String },
	phone: { type: String }
});

RepSchema.index( { bioguide_id: 1, transparencydata_id: 1 } , { unique: true } );

mongoose.model('Rep', RepSchema);