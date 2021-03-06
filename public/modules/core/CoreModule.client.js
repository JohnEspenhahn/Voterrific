'use strict';

angular.module('core', [ 'ui.bootstrap', 'ui.voterrific', 'ngSanitize', 'errors', 'voterrificFilters' ]).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/alert/alert.html',
		'<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissible\' : null]" role="alert">\n' +
		'	<button ng-show="closeable" type="button" class="close" ng-click="close()">\n' +
		'		<span aria-hidden="true">&times;</span>\n' +
		'		<span class="sr-only">Close</span>\n' +
		'	</button>\n' +
		'	<div ng-transclude></div>\n' +
		'</div>\n' +
	'');
}]);