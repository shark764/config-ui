'use strict';

angular.module('liveopsConfigPanel')
  .directive('dropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@',
        valuePath: '@',
        displayPath: '@',
        collapseIcon: '@',
        expandIcon: '@'
      },
      templateUrl : 'app/shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function($scope, element) {
        $scope.valuePath = $scope.valuePath ? $scope.valuePath : 'value';
        $scope.displayPath = $scope.displayPath ? $scope.displayPath : 'label';
        
        element.parent().css('overflow', 'visible');
        $scope.optionClick = function(func){
          $scope.showDrop = false;
          func();
        };
        
        if(! $scope.collapseIcon){
          $scope.collapseIcon = 'fa fa-caret-up';
        }
        
        if (! $scope.expandIcon){
          $scope.expandIcon = 'fa fa-caret-down';
        }
      }
    };
   }])
;
