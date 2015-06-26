'use strict';

angular.module('location').controller('LocationController', [ '$http', '$window', '$scope', 'uiGmapGoogleMapApi', 'Core', 'Location',
	function($http, $window, $scope, uiGmapGoogleMapApi, Core, Location) {
		// Start loading geolocation if available
		if ($window.navigator.geolocation) {
			$window.navigator.geolocation.getCurrentPosition(
				function(position) { // success
					Location.setGeolocation(position.coords.latitude, position.coords.longitude);
				},
				function() { // error
					console.log('Geolocate error');
					$scope.$apply(function() {
						Location.geo_error = true;
					});
				}
			);
		}
		
		// Function to check if no geolocation error and browser supports geolocation
		$scope.hasGeolocation = function() { return !Location.geo_error && $window.navigator.geolocation; };		
		$scope.getGeolocationErrorMss = function() { return (this.hasGeolocation() ? '' : 'Geolocation disabled by user'); };

		$scope.setLocationLoading = function() {
			Core.removeRow({ _id: $scope.row._id });
			Location.addLoadingLocationRow();
		};

		// Send load districts with geolocaiton
		$scope.withCurrentLocation = function() {
			$scope.setLocationLoading();
			Location.withGeoLocation(Location.loadWithLatLng);
		};

		// Send load districts with address
		$scope.withAddress = function() {
			$scope.setLocationLoading();
			
			$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent($scope.address) + '&key=AIzaSyD0d7h9MKnvO8J_aWUO1PdJP4hntSzRWfA')
				.success(function(data) {
						var location = data.results[0].geometry.location;
						Location.loadWithLatLng(location.lat, location.lng);
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