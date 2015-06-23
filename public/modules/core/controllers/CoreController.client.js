'use strict';

angular.module('core').controller('CoreController', [ '$scope', '$location', '$http', 'Core', 'Errors',
	function($scope, $location, $http, Core, Errors) {
		// Initialize
		Core.init($scope);

		// Add error messages as they occur
		$scope.$watch('error', function() {
			if ($scope.error) {
				Core.sendError($scope.error);
			}
	   });
		
		// Load error message from location search
		var err = $location.search().error;
		if (err) {
			Core.sendError(err);
			$location.search('error', null);
		}
	}
])

// Main entry
.directive('voterrificEntry', [ '$templateCache', '$sce', '$compile', function($templateCache, $sce, $compile) {
	var linker = function(scope, element) {
		var templateUrl = 'views/templates/' + scope.row.type + scope.folder + '.html';

		console.log('Entry ' + scope.row.type);
		
		element.html($templateCache.get(templateUrl));
		$compile(element.contents())(scope);
    };
	
	return {
		restrict:'E',
		link: linker,
		scope: {
			folder: '=',
			
			row: '=',
			content: '='
			
		}
	};
}]);