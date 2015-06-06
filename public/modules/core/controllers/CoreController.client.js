'use strict';

angular.module('core').controller('CoreController', [ '$scope', '$location', '$http', 'Core', 'Errors',
	function($scope, $location, $http, Core, Errors) {
		Core.init($scope);
	
		// Load error message from location search
		var err = $location.search().error;
		if (err) {
			Core.minimizeAll();
			Core.addFirstRow({ _id: 'error_id', title: 'Error', body: Errors.lookup(err), isOpen: true });
		}
		$location.search('error', null);
	}
]);