'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', '$timeout', function(filterFilter, $timeout) {
    return {
      restrict: 'E',
      scope : {
        items: '=',
        selectedItem: '=?',
        nameField: '@',
        onSelect: '&',
        isRequired: '=',
        placeholder: '@',
        hover: '=',
        prefill: '=',
        keepExpanded: '=',
        onEnter: '&'
      },

      templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

      link: function($scope) {
        $scope.currentText = $scope.prefill || '';

        $scope.$watch('currentText', function() {
          var filteredItems;

          if ($scope.nameField) {
            var filterCriteria = $scope.filterCriteria = {};
            filterCriteria[$scope.nameField] = $scope.currentText;
            filteredItems = filterFilter($scope.items, filterCriteria, true);
          } else {
            filteredItems = filterFilter($scope.items, function(item) {
              return item.getDisplay() === $scope.currentText;
            }, true);
          }

          if (!$scope.currentText) {
            $scope.selectedItem = null;
          } else if (filteredItems && filteredItems.length === 1) {
            $scope.selectedItem = filteredItems[0];

            //Empty timeout forces onSelect to only be called after digest is complete,
            //so the variable bound to selectedItem will have been properly updated
            //$timeout($scope.onSelect, 1);
            $timeout(function() {
              $scope.onSelect({selectedItem: filteredItems[0]});
            });

          } else {
            $scope.selectedItem = {};
            $scope.selectedItem[$scope.nameField] = $scope.currentText;
          }
        });

        $scope.select = function(item) {
          $scope.hovering = false;
          $scope.selectedItem = item;
          $scope.currentText = $scope.nameField ? $scope.selectedItem[$scope.nameField] : $scope.selectedItem.getDisplay();
        };

        $scope.onBlur = function() {
          if (!$scope.keepExpanded) { //Prevents the button in multibox from jumping around
            $scope.showSuggestions = false;
          }
        };
        
        $scope.$watch('selectedItem', function(newValue){
          if (newValue === null){
            $scope.currentText = '';
          }
        });
      }
    };
  }]);
