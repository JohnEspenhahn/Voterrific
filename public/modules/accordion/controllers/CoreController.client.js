'use strict';

angular.module('core').controller('CoreController', [ '$scope', 'Core', function($scope, Core) {	
	// Load rows from server
	$scope.rows = [];
	Core.getRows()
		.success(function (data) {
			$scope.rows = data;
		})
		.error(function (err) {
			console.log('An error has occured! ' + err);
		});
		
	// Accordion row status
	$scope.row_status = {
		open: { }
	};
}]);