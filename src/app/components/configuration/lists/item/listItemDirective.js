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
          if (!$scope.item[field.name]) {
            delete $scope.item[field.name];
          }
        };
        
        $scope.getName = function getName(field) {
          return $scope.index + '.' + field.name;
        };
        
        $scope.initBool = function initBool(item, field) {
          if(angular.isUndefined(item[field.name]) && field.required) {
            item[field.name] = false;
          }
        };
      }
    };
  }]);