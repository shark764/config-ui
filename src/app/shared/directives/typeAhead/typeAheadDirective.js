'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', function(filterFilter) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        selectedItem: '=',
        nameField: '@',
        onSelect: '&'
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

      link: function ($scope) {
        $scope.nameField = $scope.nameField || 'name';

        $scope.currentText = '';

        $scope.$watch('selectedItem', function () {
          if($scope.selectedItem === null){
            $scope.currentText = '';
          }
        });

        $scope.$watch('currentText', function () {
          $scope.filterCriteria = {};
          $scope.filterCriteria[$scope.nameField] = $scope.currentText;

          var items = filterFilter($scope.filtered, $scope.filterCriteria, true);

          if(items && items.length > 0){
            $scope.selectedItem = items[0];
            $scope.onSelect();
          } else {
            $scope.selectedItem = {};
            $scope.selectedItem[$scope.nameField] = $scope.currentText;
          }
        });

        $scope.select = function (item){
          $scope.hovering = false;
          $scope.selectedItem = item;
          $scope.currentText = $scope.selectedItem[$scope.nameField];
        };
      }
    };
  }]);
