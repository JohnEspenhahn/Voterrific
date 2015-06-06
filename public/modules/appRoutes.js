'use strict';

angular.module('app').config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'CoreController'
	})
	.otherwise({
        redirectTo: '/'
    });
	
	$locationProvider.html5Mode(true);
}]);