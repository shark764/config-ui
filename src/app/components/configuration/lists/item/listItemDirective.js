'use strict';

angular.module('liveopsConfigPanel')
  .directive('listItem', [function() {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        listType: '=',
        index: '@'
      },
      templateUrl: 'app/components/configuration/lists/item/listItem.html',
      link: function($scope) {
        $scope.inputChange = function inputChange(field) {
          if ($scope.item[field.name] === null) {
            delete $scope.item[field.name]
          }
        };
        
        $scope.getName = function getName(field) {
          return $scope.index + '.' + field.name;
        }
      }
    }
  }]);