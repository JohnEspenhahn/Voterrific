'use strict';

angular.module('ui.voterrific', ['ui.bootstrap.collapse', 'hmTouchEvents'])

.constant('accordionConfig', {
  closeOthers: false
})

.controller('VoterrificAccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    console.log('close others ' + closeOthers); // debug
    if (closeOthers) {
      angular.forEach(this.groups, function (group) {
        if (!group.isPinned && group !== openGroup) {
          group.isOpen = false;
        }
      });
    }
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
    if (index !== -1) {
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
    replace: false,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('voterrificAccordionGroup', ['$timeout', function($timeout) {
  return {
    require:'^voterrificAccordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:false,
    templateUrl:'views/templates/accordion/accordion-group.html',
    scope: {
      isOpen: '=?',
      isDisabled: '=?',
      isPinned: '=?',
      row: '='
    },
    link: function(scope, element, attrs, accordionCtrl) {
      accordionCtrl.addGroup(scope);

      // Close others on open
      scope.$watch('isOpen', function(value) {
        if (value) {
          accordionCtrl.closeOthers(scope);
        }
      });

      // Handle pin on right click
      element.bind('contextmenu', function(event) {
          scope.$apply(function() {
            console.log('Right click'); // debug
            event.preventDefault();
            scope.isOpen = scope.isPinned = !scope.isPinned;
          });
      });

      // Handle pin on long tap
      var tapTimer = null;
      scope.onTapDown = function(event) { 
        console.log('Tap down'); // debug
        tapTimer = $timeout(function() {
          tapTimer = null;
          scope.isOpen = scope.isPinned = !scope.isPinned;
        }, 50);
      };

      scope.onTapUp = function(event) {
        console.log('Tap up'); // debug
        if (tapTimer !== null) {
          $timeout.cancel(tapTimer);
          tapTimer = null;

          scope.onTap();
        }
      };

      scope.onTap = function() {
        if (!scope.isDisabled) {
          console.log('On click'); // debug
          scope.isOpen = !scope.isOpen;

          // When closing unpin
          if (!scope.isOpen) scope.isPinned = false;
        }
      };
    }
  };
}]);