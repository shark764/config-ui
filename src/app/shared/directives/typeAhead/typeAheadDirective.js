'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', '$compile', function(filterFilter, $compile) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        selectedItem: '='
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

      link: function ($scope, ele, attrs, ctrl) {
        $scope.currentText = '';

        $scope.$watch('selectedItem', function () {
          if($scope.selectedItem === null){
            $scope.currentText = '';
          }
        });

        $scope.$watch('currentText', function () {
          var items = filterFilter($scope.filtered, {name : $scope.currentText }, true);

          if(items && items.length > 0){
            $scope.selectedItem = items[0]
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
