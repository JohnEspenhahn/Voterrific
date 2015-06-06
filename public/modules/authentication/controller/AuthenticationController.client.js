'use strict';

angular.module('authentication').controller('AuthenticationController', [ '$scope', '$http', '$location', 'Authentication', function($scope, $http, $location, Authentication) {
	// Put authentication on the scope
	$scope.authentication = Authentication;
	
	// Log out
	$scope.logout = function() {
			$http.get('/auth/logout')
				.success(function(data) {
					if (!data || !data.success) {
						$scope.error = 'Logout failed';
					} else {
						Authentication.user = null;
					}
				})
				.error(function(err) {
					$scope.error = err;
				});
		};
	
}]);