'use strict';

angular.module('authentication').controller('AuthenticationController', [ '$scope', '$http', '$window', '$location', 'Authentication', 
	function($scope, $http, $window, $location, Authentication) {
		// Put authentication on the scope
		$scope.authentication = Authentication;
		
		// Log out
		$scope.logout = function() {
				$http.get('/auth/logout')
					.success(function(data) {
						if (!data || !data.success) {
							$scope.error = 'Logout failed';
						} else {
							$window.location.reload();
						}
					})
					.error(function(err) {
						$scope.error = err;
					});
			};
	}
]);