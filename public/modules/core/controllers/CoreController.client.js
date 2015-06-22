'use strict';

angular.module('core').controller('CoreController', [ '$scope', '$location', '$http', 'Core', 'Errors',
	function($scope, $location, $http, Core, Errors) {
		// Initialize
		Core.init($scope);

		// Add error messages as they occur
		$scope.$watch('error', function() {
			if ($scope.error) {
				var newAlert = { _id: $scope.error, type: 'danger', content: { text: $scope.error } };
				if (!Core.hasAlert(newAlert)) Core.addAlert(newAlert);
			}
	   });
		
		// Load error message from location search
		var err = $location.search().error;
		if (err) {
			Errors.setScopeError($scope, err);
			$location.search('error', null);
		}
	}
])

// Main entry
.directive('voterrificEntry', [ '$templateCache', '$sce', '$compile', function($templateCache, $sce, $compile) {
	var linker = function(scope, element) {
		var templateUrl = 'views/templates/' + scope.control.type + scope.folder + '.html';
		
		element.html($templateCache.get(templateUrl));
		$compile(element.contents())(scope);
    };
	
	return {
		restrict:'E',
		link: linker,
		replace: true,
		scope: {
			folder: '=',
			
			control: '=',
			content: '='
			
		}
	};
}]);