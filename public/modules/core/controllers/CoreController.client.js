'use strict';

angular.module('core').controller('CoreController', [ '$scope', '$location', '$http', 'Core', 'Errors',
	function($scope, $location, $http, Core, Errors) {
		// Initialize
		Core.init($scope);

		// Add error messages as they occur
		$scope.$watch('error', function() {
			if ($scope.error) {
				var newRow = { _id: $scope.error, title: 'Error', body: $scope.error, isOpen: true };
				if (!Core.hasRow(newRow)) Core.addFirstRow(newRow);
			}
	   });
	
		// Load error message from location search
		var err = $location.search().error;
		if (err) {
			Errors.setScopeError($scope, err);
			$location.search('error', null);
		}
	}
]);