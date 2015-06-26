'use strict';

angular.module('location').factory('Location', ['$http', 'Core', function($http, Core) {
	return {
		/**
		 * Load location based data with the given latitude and longitude
		 * @param {Number} lat
		 * @param {Number} lng
		 */
		loadWithLatLng: function(lat, lng) {
			$http.get('/loadRepresentatives/' + lat + '/' + lng)
				.success(function(data) {
					Core.removeRow({ _id: 'location_loading' });

					if (!data.error) {
						console.log(data);
						for (var key in data) {
							Core.addLastRow(data[key]);
						}
					} else {
						Core.sendError('Failed to load your representatives!');
					}
				})
				.error(function(data) {
					Core.removeRow({ _id: 'location_loading' });

					Core.sendError('Failed to load your representatives!');
				});
		},

		/** @type {Boolean} True if an error has occured while trying to geolocate */
		geo_error: false,
		/** @type {Number|null} */ geo_lat: null, 
		/** @type {Number|null} */ geo_lng: null,

		/** @type {[function(Number,Number)]} List of functions that have requested geolocation but have not gotten it yet */
		toGeoLocate: [],

		/**
		 * Add a callback to run one we have geolocation
		 * @param {function(Number, Number)} callback The callback to call (passed lat and lng)
		 */
		withGeoLocation: function(callback) {
			if (!this.geo_error && this.geo_lat && this.geo_lng) {
				callback(this.geo_lat, this.geo_lng);
			} else if (this.toGeoLocate) {
				this.toGeoLocate.push(callback);
			} else {
				console.log('Unhandled state of geolocation!');
			}
		},

		/** 
		 * Set the geolocation once it is loaded and call functions that have requested geolocation
		 * @param {Number} lat
		 * @param {Number} lng
		 */
		setGeolocation: function(lat, lng) {
			this.geo_lat = lat;
			this.geo_lng = lng;
			// Call the functions already requesting location
			for (var i = 0; i < this.toGeoLocate.length; i++) {
				this.toGeoLocate[i].call(this, lat, lng);
			}
			this.toGeoLocate = null;
		},

		addLoadingLocationRow: function() {
			var loadingRow = { _id: 'location_loading', isOpen: true, noHeader: true, type: 'Loading', content: { text: 'Loading representatives' } };
			if (!Core.hasRow(loadingRow)) {
				console.log('Adding loading row');
				Core.addFirstRow(loadingRow);
			}
		}
	};
}]);