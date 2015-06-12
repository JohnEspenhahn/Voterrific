angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/templates/LocationSetupBody.html',
    "<div class=\"text-center\" ng-controller=\"LocationController\">\n" +
    "\t<p>\n" +
    "\t\tPlease provide your home address so we can determine your representatives.\n" +
    "\t\t<span class=\"glyphicon glyphicon-info-sign glyphicon-inverse\" popover=\"Your address is not saved on our servers.\" popover-trigger=\"mouseenter\" aria-hidden=\"true\"></span>\n" +
    "\t</p>\n" +
    "\t<div class=\"geolocation\">\n" +
    "\t\t<p style=\"display: inline-block;\" popover=\"{{ getGeolocationErrorMss() }}\" popover-trigger=\"mouseenter\">\n" +
    "\t\t\t<button type=\"button\" class=\"btn btn-default\" ng-click=\"withCurrentLocation()\" ng-disabled=\"!hasGeolocation()\">Use my current location</button>\n" +
    "\t\t</p>\n" +
    "\t\t<p>\n" +
    "\t\t\t<b>OR</b>\n" +
    "\t\t</p>\n" +
    "\t</div>\n" +
    "\t<form class=\"form\" ng-submit=\"withAddress()\">\n" +
    "\t\t<div class=\"row form-group\">\n" +
    "\t\t\t<div class=\"col-xs-12 col-md-6 col-md-offset-3\">\n" +
    "\t\t\t\t<label class=\"sr-only\" for=\"address\">Address</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control address\" ng-model=\"address\" ng-model-options=\"{ getterSetter: true }\" id=\"address\" placeholder=\"Home Address\" auto-address required>\n" +
    "\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">Submit</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );

}]);
