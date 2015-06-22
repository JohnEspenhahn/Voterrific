'use strict';

angular.module('location').controller('LocationController', [ '$http', '$window', '$scope', 'uiGmapGoogleMapApi', 'Core',
	function($http, $window, $scope, uiGmapGoogleMapApi, Core) {
		// Ensure we have geolocation before calling functions that need it
		$scope.geolocateError = false;
		var lat, lng, toGeoLocate = [];
		function withGeoLocation(callback) {
			if (!$scope.geolocateError && lat && lng) {
				callback(lat, lng);
			} else if (toGeoLocate) {
				toGeoLocate.push(callback);
			}
		}
		
		// Start loading geolocation if available
		if ($window.navigator.geolocation) {
			$window.navigator.geolocation.getCurrentPosition(
				function(position) { // success
					lat = position.coords.latitude;
					lng = position.coords.longitude;

					// Call the functions already requesting location
					for (var i = 0; i < toGeoLocate.length; i++) {
						(toGeoLocate[i])(lat, lng);
					}
					toGeoLocate = null;
				},
				function() { // error
					console.log('Geolocate error');
					$scope.$apply(function() {
						$scope.geolocateError = true;
					});
				}
			);
		}
		
		// Function to check if no geolocation error and browser supports geolocation
		$scope.hasGeolocation = function() { return !$scope.geolocateError && $window.navigator.geolocation; };
		
		$scope.getGeolocationErrorMss = function() { return (this.hasGeolocation() ? '' : 'Geolocation disabled by user'); };

		var loadWithLatLng = function(lat, lng) {
			$http.get('/loadDistricts/' + lat + '/' + lng)
				.success(function(data) {
					if (!data.error) {
						Core.removeRow({ _id: $scope.row._id });

						console.log(data);
						for (var key in data) {
							Core.addFirstRow(data[key]);
						}
					} else {
						Core.sendError('Failed to load your representatives!');
					}
				})
				.error(function(data) {
					Core.sendError('Failed to load your representatives!');
				});
		};

		// Send load districts with geolocaiton
		$scope.withCurrentLocation = function() {
			withGeoLocation(loadWithLatLng);
		};

		// Send load districts with address
		$scope.withAddress = function() {
			$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent($scope.address) + '&key=AIzaSyD0d7h9MKnvO8J_aWUO1PdJP4hntSzRWfA')
				.success(function(data) {
						var location = data.results[0].geometry.location;
						loadWithLatLng(location.lat, location.lng);
				})
				.error(function(data) {
					Core.sendError('Failed to load your representatives with the given address!');
				});
		};
		
		// Start loading google maps api
		uiGmapGoogleMapApi.then(function(maps) {
			// TODO
			if ($scope.row.type === 'Location') {
				console.log('Google maps ready for main location view');
			} else if ($scope.row.type === 'LocationSetup') {
				console.log('Google maps ready for setup location view');
			} else {
				console.log('Google maps ready for other location view');
			}
	    });
	}
])

.directive('autoAddress', function() {
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function(scope, element, attrs, ngModel) {
			scope.googleAutocomplete = new google.maps.places.Autocomplete(element[0], { types: [ 'geocode' ] });

			// Update model when select autocomplete value
			google.maps.event.addListener(scope.googleAutocomplete, 'place_changed', function() {
				var newAddress = scope.googleAutocomplete.getPlace().formatted_address;
				scope.$apply(function(){
                    ngModel.$setViewValue(newAddress);
                });
			});
		}
	};
});