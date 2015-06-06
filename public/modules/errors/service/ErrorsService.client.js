'use strict';

angular.module('errors').factory('Errors', [ '$http', function($http) {
	// Load errors from json
	var ERRORS = { };
	
	// expose
	return {
		setScopeError: function($scope, code) {
			console.log('Setting error to: ' + code);
			
			if (ERRORS[code]) {
				$scope.error = ERRORS[code]; // load form cache
			} else {
				$http.get('/errors?code=' + code)
					.success(function(data) {
						ERRORS[data.key] = data.value; // cache
						
						$scope.error = data.value;
					})
					.error(function(err) {
						$scope.error = 'Error while loading error message! "' + err.message + '"';
					});
			}
		}
	};
}]);