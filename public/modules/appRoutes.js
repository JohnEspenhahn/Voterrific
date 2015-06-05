'use strict';

angular.module('appRoutes', []).config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'views/home.html',
		controller: 'CoreController'
	});
	
	$locationProvider.html5Mode(true);
}]);