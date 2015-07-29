'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', '$timeout', function(filterFilter, $timeout) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        selectedItem: '=',
        nameField: '@',
        onSelect: '&',
        isRequired: '=',
        placeholder: '@',
        hover: '='
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

      link: function ($scope) {
        $scope.nameField = $scope.nameField || 'name';

        $scope.currentText = '';

        $scope.$watch('selectedItem', function () {
          if(angular.isUndefined($scope.selectedItem) || $scope.selectedItem === null){
            $scope.currentText = '';
          }
        });

        $scope.$watch('currentText', function () {
          $scope.filterCriteria = {};
          $scope.filterCriteria[$scope.nameField] = $scope.currentText;

          var filteredItems = filterFilter($scope.items, $scope.filterCriteria, true);
          if (! $scope.currentText){
            $scope.selectedItem = null;
          } else if (filteredItems && filteredItems.length === 1){
            $scope.selectedItem = filteredItems[0];
            
            //Empty timeout forces onSelect to only be called after digest is complete, 
            //so the variable bound to selectedItem will have been properly updated
            $timeout($scope.onSelect, 1);
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
