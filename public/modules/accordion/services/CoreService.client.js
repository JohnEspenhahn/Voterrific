'use strict';

// Front end link to backed AccordionRowRoutes
angular.module('core').factory('Core', [ '$http', function ($http) {
	
	return {
		getRows: function() {
			return $http.get('/rows');
		}
	};
	
}]);
