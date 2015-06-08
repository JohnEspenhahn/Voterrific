'use strict';

angular.module('core', [ 'ui.bootstrap', 'errors' ]).run(['$templateCache', function($templateCache) {
	// Custom accordion template
	$templateCache.put('template/accordion/accordion-group.html',
		'<div class=\"panel panel-default\">\n' +
		'  <div class=\"panel-heading accordion-heading\" ng-if=\"isCloseable\">\n' +
		'    <h4 class=\"panel-title\">\n' +
		'      <a href=\"javascript:void(0)\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\"><span ng-class=\"{\'text-muted\': isDisabled}\">{{heading}}</span></a>\n' +
		'    </h4>\n' +
		'  </div>\n' +
		'  <div class=\"panel-collapse collapse\" collapse=\"!isOpen && isCloseable\">\n' +
		'	  <div class=\"panel-body\" ng-transclude></div>\n' +
		'  </div>\n' +
		'</div>\n' +
    '');
	
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