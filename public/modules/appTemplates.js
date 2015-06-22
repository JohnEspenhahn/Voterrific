angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/templates/LocationSetupBody.html',
    "<div class=\"text-center\" ng-controller=\"LocationController\">\r" +
    "\n" +
    "\t<br />\r" +
    "\n" +
    "\t<p>\r" +
    "\n" +
    "\t\tPlease provide your home address so we can determine your representatives.\r" +
    "\n" +
    "\t\t<span class=\"glyphicon glyphicon-info-sign glyphicon-inverse\" popover=\"Your address is not saved on our servers.\" popover-trigger=\"mouseenter\" aria-hidden=\"true\"></span>\r" +
    "\n" +
    "\t</p>\r" +
    "\n" +
    "\t<div class=\"geolocation\">\r" +
    "\n" +
    "\t\t<p style=\"display: inline-block;\" popover=\"{{ getGeolocationErrorMss() }}\" popover-trigger=\"mouseenter\">\r" +
    "\n" +
    "\t\t\t<button type=\"button\" class=\"btn btn-default\" ng-click=\"withCurrentLocation()\" ng-disabled=\"!hasGeolocation()\">Use my current location</button>\r" +
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
    "\t<form class=\"form\" ng-submit=\"withAddress()\">\r" +
    "\n" +
    "\t\t<div class=\"row form-group\">\r" +
    "\n" +
    "\t\t\t<div class=\"col-xs-12 col-md-6 col-md-offset-3\">\r" +
    "\n" +
    "\t\t\t\t<label class=\"sr-only\" for=\"address\">Address</label>\r" +
    "\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control address\" ng-model=\"address\" ng-model-options=\"{ getterSetter: true }\" id=\"address\" placeholder=\"Home Address\" auto-address required>\r" +
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


  $templateCache.put('views/templates/RepBody.html',
    "<img src=\"{{ content.photo_url || '/img/blank-profile.jpg' }}\" alt=\"Photo\" height=\"64\" width=\"64\">\r" +
    "\n" +
    "{{ content.name }}\r" +
    "\n" +
    "<img src=\"{{ '/img/' + content.party + '.png' }}\" alt=\"{{ content.party }}\" height=\"24\" width=\"24\">"
  );


  $templateCache.put('views/templates/RepHead.html',
    "<img src=\"{{ content.photo_url || '/img/blank-profile.jpg' }}\" alt=\"Photo\" height=\"32\" width=\"32\">\r" +
    "\n" +
    "{{ content.name }}\r" +
    "\n" +
    "<img src=\"{{ '/img/' + content.party + '.png' }}\" alt=\"{{ content.party }}\" height=\"24\" width=\"24\">"
  );


  $templateCache.put('views/templates/accordion/accordion-group.html',
    "<div class=\"panel panel-default\">\r" +
    "\n" +
    "  <div class=\"panel-heading accordion-heading\" ng-if=\"row.isCloseable\">\r" +
    "\n" +
    "    <h4 class=\"panel-title\">\r" +
    "\n" +
    "      <a href=\"javascript:void(0)\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" voterrific-accordion-transclude=\"heading\"></a>\r" +
    "\n" +
    "    </h4>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"panel-collapse collapse\" collapse=\"!isOpen\">\r" +
    "\n" +
    "\t  <div class=\"panel-body\" ng-transclude></div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>"
  );

}]);
