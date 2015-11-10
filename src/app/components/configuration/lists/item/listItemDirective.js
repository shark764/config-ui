'use strict';

angular.module('liveopsConfigPanel')
  .directive('listItem', [function() {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        listType: '='
      },
      templateUrl: 'app/components/configuration/lists/item/listItem.html',
      link: function($scope) {
        
      }
    }
  }]);