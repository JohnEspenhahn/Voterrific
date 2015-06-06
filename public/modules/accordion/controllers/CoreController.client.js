'use strict';

angular.module('core').controller('CoreController', [ '$scope', '$location', 'Core', function($scope, $location, Core) {	
	// Load rows from server
	$scope.rows = [];
	Core.getRows()
		.success(function (data) {
			// Defaults
			data.isOpen = data.isOpen || false;
			
			// Add to scope
			$scope.rows = data;
		})
		.error(function (err) {
			$scope.error = err.message;
			console.log('An error has occured! ' + err);
		});
		
	// Load error message from location search
	$scope.error = $location.search().error;
	$location.search('error', null);
}]);