'use strict';

angular.module('authentication').factory('Authentication', [ '$window', '$http', function($window, $http) {

	console.log($window.user);

	return {
		user: $window.user
	};
	
}]);