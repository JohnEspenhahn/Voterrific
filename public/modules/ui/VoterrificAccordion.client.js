'use strict';

angular.module('ui.voterrific', ['ui.bootstrap.collapse'])

.controller('VoterrificAccordionController', ['$scope', '$attrs', function ($scope, $attrs) {

  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    angular.forEach(this.groups, function (group) {
      if ( group !== openGroup ) {
        group.isOpen = false;
      }
    });
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function (event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if ( index !== -1 ) {
      this.groups.splice(index, 1);
    }
  };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('voterrificAccordion', function () {
  return {
    restrict:'EA',
    controller:'VoterrificAccordionController',
    transclude: true,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('voterrificAccordionGroup', function() {
  return {
    require:'^voterrificAccordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:false,
    templateUrl:'views/templates/accordion/accordion-group.html',
    scope: {
      isOpen: '=?',
      isDisabled: '=?',
      row: '='
    },
    link: function(scope, element, attrs, accordionCtrl) {
      accordionCtrl.addGroup(scope);

      scope.toggleOpen = function(event) {
        console.log(event);
        if ( !scope.isDisabled ) {
          scope.isOpen = !scope.isOpen;

          if (event.shiftKey) {
            accordionCtrl.closeOthers(scope);
          }
        }
      };
    }
  };
});