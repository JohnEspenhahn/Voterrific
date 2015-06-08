angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/templates/LocationSetupBody.html',
    "<div class=\"text-center\" ng-controller=\"LocationController\">\r" +
    "\n" +
    "\t<p>\r" +
    "\n" +
    "\t\tPlease provide your home address so we can determine your representatives.\r" +
    "\n" +
    "\t\t<span class=\"glyphicon glyphicon-info-sign glyphicon-inverse\" popover=\"No personally identifying information is saved on the server.\" popover-trigger=\"mouseenter\" aria-hidden=\"true\"></span>\r" +
    "\n" +
    "\t</p>\r" +
    "\n" +
    "\t<div class=\"geolocation\" ng-if=\"hasGeolocation()\">\r" +
    "\n" +
    "\t\t<p>\r" +
    "\n" +
    "\t\t\t<button type=\"button\" class=\"btn btn-default\">Use my current location</button>\r" +
    "\n" +
    "\t\t</p>\r" +
    "\n" +
    "\t\t<p>\r" +
    "\n" +
    "\t\t\t<b>OR</b>\r" +
    "\n" +
    "\t\t</p>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<form class=\"form\">\r" +
    "\n" +
    "\t\t<div class=\"row form-group\">\r" +
    "\n" +
    "\t\t\t<div class=\"col-xs-12 col-md-6 col-md-offset-3\">\r" +
    "\n" +
    "\t\t\t\t<label class=\"sr-only\" for=\"address\">Address</label>\r" +
    "\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control address\" id=\"address\" placeholder=\"Home Address\" auto-address required>\r" +
    "\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">Submit</button>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</form>\r" +
    "\n" +
    "</div>"
  );

}]);
