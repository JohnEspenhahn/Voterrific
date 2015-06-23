'use strict';

var winston = require('winston'),
	mongoose = require('mongoose'),
	Rep = mongoose.model('Rep');

// Scrub a rep from https://sunlightlabs.github.io/congress/legislators.html
function scrubCongress(rep) {
	return new Rep({
		bioguide_id: rep.bioguide_id,
		
		name: (rep.nickname || rep.first_name) + ' ' + (rep.middle_name ? rep.middle_name + ' ' : '') + rep.last_name,
		party: rep.party,
		term: new Date(rep.term_start).getFullYear() + '-' + new Date(rep.term_end).getFullYear(),
		chamber: 'US ' + rep.chamber.substring(0,1).toUpperCase() + rep.chamber.substring(1),
		district: rep.state + ' ' + (rep.district || ''),

		photo_url: (rep.facebook_id ? 'https://graph.facebook.com/v2.3/' + rep.facebook_id + '/picture' : undefined),
		contact_url: rep.contact_form,
		phone: rep.phone
	});
}

// Scrub rep from http://sunlightlabs.github.io/openstates-api/legislators.html#examples/geo-lookup
function scrubOpenstates(rep) {
	// Get the best phone number for this rep
	var phone;
	for (var key in rep.offices) {
		var office = rep.offices[key];

		if (office.type === 'capitol' && office.phone) {
			phone = office.phone;
			break;
		} else if (office.phone) {
			phone = office.phone;
		}
	}

	// Get the term for this rep
	var term;
	for (key in rep.roles) {
		var role = rep.roles[key];

		if (role.type === 'member' && role.term) {
			term = role.term;
			break;
		}
	}

	// Create rep
	return new Rep({
		transparencydata_id: rep.transparencydata_id,

		name: rep.full_name,
		party: rep.party.substring(0,1).toUpperCase(),
		term: term,
		chamber: rep.state.toUpperCase() + ' ' + rep.chamber.substring(0,1).toUpperCase() + rep.chamber.substring(1),
		district: rep.district,

		photo_url: rep.photo_url,
		contact_url: 'mailto:' + rep.email,
		phone: phone
	});
}

exports.scrub = function(provider, rep) {
	switch (provider) {
		case 'congress':
			return scrubCongress(rep);
		case 'openstates':
			return scrubOpenstates(rep);
		default:
			winston.warn('Unhandled rep. provider: ' + provider);
			return new Rep(rep);
	}
};