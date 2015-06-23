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
    "<img src=\"{{ content.photo_url || '/img/blank-profile.jpg' }}\" alt=\"Photo\" height=\"64\">\r" +
    "\n" +
    "{{ content.name }}\r" +
    "\n" +
    "<img src=\"{{ '/img/' + content.party + '.png' }}\" alt=\"{{ content.party }}\">\r" +
    "\n" +
    "<br />\r" +
    "\n" +
    "{{ content.district }} {{ content.chamber }}"
  );


  $templateCache.put('views/templates/RepHeader.html',
    "<div class=\"rep-header\">\r" +
    "\n" +
    "\t<div class=\"img\" style=\"background-image: url('{{ content.photo_url || '/img/blank-profile.jpg' }}');\"></div>\r" +
    "\n" +
    "\t\r" +
    "\n" +
    "\t<div class=\"title\">\r" +
    "\n" +
    "\t\t{{ content.name }}\r" +
    "\n" +
    "\t\t<br />\r" +
    "\n" +
    "\t\t<small>{{ content.chamber }}, {{ content.district }}</small>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/templates/accordion/accordion-group.html',
    "<div class=\"panel panel-default\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<!-- Header. Only shows if row.isClosable -->\r" +
    "\n" +
    "\t<div class=\"panel-heading accordion-heading\" ng-if=\"row.isCloseable\">\r" +
    "\n" +
    "\t\t<a href=\"javascript:void(0)\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen($event)\">\r" +
    "\n" +
    "\t\t\t<div class=\"accordion-title\">\r" +
    "\n" +
    "\t\t\t\t<span class=\"pull-left badge\"></span> \r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<voterrific-entry folder=\"'Header'\" row=\"row\" content=\"row.content\"></voterrific-entry>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<span class=\"pull-right badge\"></span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</a>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "  \r" +
    "\n" +
    "  \t<!-- Body -->\r" +
    "\n" +
    "\t<div class=\"panel-collapse collapse\" collapse=\"!isOpen\">\r" +
    "\n" +
    "\t\t<div class=\"panel-body\">\r" +
    "\n" +
    "\t\t\t<voterrific-entry folder=\"'Body'\" row=\"row\" content=\"row.content\"></voterrific-entry>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>"
  );

}]);
