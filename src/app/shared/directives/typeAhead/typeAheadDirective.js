'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', function(filterFilter) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        selectedItem: '=',
        nameField: '@',
        onSelect: '&',
        isRequired: '=',
        placeholder: '@',
        hover: '=',
        prefill: '='
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',


      link: function ($scope) {
        console.log(JSON.stringify($scope.items, null, 2));
        $scope.nameField = $scope.nameField || 'name';

        $scope.currentText = $scope.prefill || '';

        $scope.$watch('selectedItem', function () {
          if($scope.selectedItem === null){
            $scope.currentText = $scope.prefill || '';
          }
        });

        $scope.$watch('currentText', function () {
          $scope.filterCriteria = {};
          $scope.filterCriteria[$scope.nameField] = $scope.currentText;

          var filteredItems = filterFilter($scope.items, $scope.filterCriteria, true);

          console.log(filteredItems);

          if (! $scope.currentText){
            $scope.selectedItem = null;
          } else if (filteredItems && filteredItems.length > 0){
            $scope.selectedItem = filteredItems[0];
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
