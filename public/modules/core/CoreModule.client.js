'use strict';

angular.module('core', [ 'ui.bootstrap', 'ui.voterrific', 'ngSanitize', 'errors' ]).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/alert/alert.html',
		'<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissible\' : null]" role="alert">\n' +
		'	<button ng-show="closeable" type="button" class="close" ng-click="close()">\n' +
		'		<span aria-hidden="true">&times;</span>\n' +
		'		<span class="sr-only">Close</span>\n' +
		'	</button>\n' +
		'	<div ng-transclude></div>\n' +
		'</div>\n' +
	'');

	/**
	 * Number.prototype.format(n, x)
	 * 
	 * @param integer n: length of decimal
	 * @param integer x: length of sections
	 */
	Number.prototype.format = function(n, x) {
	    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
	};
}]);