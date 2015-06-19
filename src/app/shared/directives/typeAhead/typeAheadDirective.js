'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', function(filterFilter) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        selectedItem: '='
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

      link: function ($scope) {
        $scope.currentText = '';

        $scope.$watch('selectedItem', function () {
          if($scope.selectedItem === null){
            $scope.currentText = '';
          }
        });

        $scope.$watch('currentText', function () {
          var items = filterFilter($scope.filtered, {name : $scope.currentText }, true);

          if(items && items.length > 0){
            $scope.selectedItem = items[0];
          } else {
            $scope.selectedItem = {
              name: $scope.currentText
            };
          }
        });

        $scope.select = function (item){
          $scope.hovering = false;
          $scope.selectedItem = item;
          $scope.currentText = $scope.selectedItem.name;
        };
      }
    };
  }]);
