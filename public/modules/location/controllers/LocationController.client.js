'use strict';

angular.module('location').controller('LocationController', function($http, $window, $scope, uiGmapGoogleMapApi) {
	$scope.hasGeolocation = function() {
		return $window.navigator.geolocation;
	};
	
	var geolocateError = false, lat, lng;
	if ($scope.hasGeolocation()) {
		$window.navigator.geolocation.getCurrentPosition(
			function(position) { // success
				lat = position.coords.latitude;
				lng = position.coords.longitude;
			},
			function() { // error
				geolocateError = true;
			}
		);
	}
	
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
})

.directive('autoAddress', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.googleAutocomplete = new google.maps.places.Autocomplete(element[0], { types: [ 'geocode' ] });
		}
	};
});