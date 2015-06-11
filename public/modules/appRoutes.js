'use strict';

angular.module('app').config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'CoreController',
		reloadOnSearch: false
	})
	.when('/terms_of_use', {
		templateUrl: 'views/terms_of_use.html'
	})
	.when('/privacy_policy', {
		templateUrl: 'views/privacy_policy.html'
	})
	.otherwise({
        redirectTo: '/'
    });
	
	$locationProvider.html5Mode(true);
}]);