angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/templates/alerts/error.html',
    "<div class=\"alert alert-danger alert-dismissible\" role=\"alert\">\r" +
    "\n" +
    "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\r" +
    "\n" +
    "  <strong>Error!</strong> {{ content.text }}\r" +
    "\n" +
    "</div>"
  );

}]);
