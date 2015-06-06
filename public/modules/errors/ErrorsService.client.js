'use strict';

angular.module('errors').factory('Errors', [ '$http', function($http) {
	var ERRORS = { };
	$http.get('/modules/errors/data/errors.json')
		.success(function(data) {
			ERRORS = data;
		})
		.error(function(err) {
			console.log('Failed to load errors json! ' + err);
		});
	
	return {
		getMessage: function(code) {
			return ERRORS[code];
		}
	};
}]);