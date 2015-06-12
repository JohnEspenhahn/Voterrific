'use strict';

angular.module('location').controller('LocationController', [ '$http', '$window', '$scope', 'uiGmapGoogleMapApi',
	function($http, $window, $scope, uiGmapGoogleMapApi) {
		$scope.hasGeolocation = function() { return $window.navigator.geolocation; };

		// Send load districts with geolocaiton
		$scope.withCurrentLocation = function() {
			withGeoLocation(function(lat, lng) {
				$http.get('/loadDistricts/' + lat + '/' + lng)
					.success(function(data) {
						console.log('Loaded distrcts');
					})
					.error(function(data) {
						$scope.error = 'Failed to load districts with your current location!';
					});
			});
		};

		// Send load districts with address
		$scope.withAddress = function() {
			$http.get('/loadDistricts/' + $scope.address)
				.success(function(data) {
					console.log('Loaded distrcts');
				})
				.error(function(data) {
					$scope.error = 'Failed to load districts with the given address!';
				});
		};

		// Ensure we have geolocation before calling functions that need it
		$scope.geolocateError = false;
		var lat, lng, toGeoLocate = [];
		function withGeoLocation(callback) {
			if (!$scope.geolocateError && lat && lng) {
				callback(lat, lng);
			} else {
				toGeoLocate.push(callback);
			}
		}
		
		// Start loading geolocation if available
		if ($scope.hasGeolocation()) {
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
					$scope.geolocateError = true;
				}
			);
		}
		
		// Start loading google maps api
		uiGmapGoogleMapApi.then(function(maps) {
			// TODO
			if ($scope.control.type === 'Location') {
				console.log('Google maps ready for main location view');
			} else if ($scope.control.type === 'LocationSetup') {
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