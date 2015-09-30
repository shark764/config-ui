'use strict';

angular.module('liveopsConfigPanel')
  .directive('typeAhead', ['filterFilter', '$timeout',
    function (filterFilter, $timeout) {
      return {
        restrict: 'E',
        scope: {
          items: '=',
          selectedItem: '=?',
          onSelect: '&',
          isRequired: '=',
          placeholder: '@',
          hover: '=',
          prefill: '=',
          keepExpanded: '=',
          onEnter: '&',
          nameField: '@',
          filters: '=?'
        },

        templateUrl: 'app/shared/directives/typeAhead/typeAhead.html',

        controller: function ($scope) {
          var self = this;
          $scope.currentText = $scope.prefill || '';

          this.defaultTextFilter = function defaultTextFilter(item, text) {
            return item.getDisplay().toLowerCase().contains(text.toLowerCase());
          };

          //TODO make this go away
          this.nameFieldTextFilter = function nameFieldTextFilter(item, text) {
            return item[$scope.nameField].toLowerCase().contains(text.toLowerCase());
          };

          $scope.filterCriteria = function (item) {
            if (!$scope.filterArray) {
              return;
            }

            var include = true;
            for (var filterIndex = 0; filterIndex < $scope.filterArray.length; filterIndex++) {
              var filter = $scope.filterArray[filterIndex];
              include = include && filter.call(filter, item, $scope.currentText, $scope.items);
            }
            return include;
          };

          $scope.$watch('filters', function (newCriteria, oldCriteria) {
            $scope.filterArray = [];

            if (newCriteria && angular.isArray(newCriteria)) {
              $scope.filterArray = angular.copy(newCriteria);
            } else if (newCriteria && !angular.isArray(newCriteria)) {
              $scope.filterArray = [newCriteria];
            }

            if ($scope.nameField) {
              $scope.filterArray.push(self.nameFieldTextFilter);
            } else {
              $scope.filterArray.push(self.defaultTextFilter);
            }
          }, true);

          $scope.$watch('currentText', function () {
            var filteredItems = filterFilter($scope.items, $scope.filterCriteria);

            if (filteredItems && filteredItems.length === 1) {
              $scope.currentText = filteredItems[0].getDisplay(); //Force capitalization to be the same as the item display
            }

            if (!$scope.currentText) {
              $scope.selectedItem = null;
            } else if (filteredItems && filteredItems.length === 1) {
              $scope.selectedItem = filteredItems[0];

              //Empty timeout forces onSelect to only be called after digest is complete,
              //so the variable bound to selectedItem will have been properly updated
              //$timeout($scope.onSelect, 1);
              $timeout(function () {
                $scope.onSelect({
                  selectedItem: filteredItems[0]
                });
              });

            } else {
              delete $scope.selectedItem;
              if ($scope.nameField) {
                $scope.selectedItem = {};
                $scope.selectedItem[$scope.nameField] = $scope.currentText;
              }
            }
          });

          $scope.select = function (item) {
            $scope.hovering = false;
            $scope.selectedItem = item;
            $scope.currentText = $scope.nameField ? $scope.selectedItem[$scope.nameField] : $scope.selectedItem.getDisplay();
          };

          $scope.onBlur = function () {
            if (!$scope.keepExpanded) { //Prevents the button in multibox from jumping around
              $scope.showSuggestions = false;
            }
          };

          $scope.$watch('selectedItem', function (newValue) {
            if (newValue === null) {
              $scope.currentText = '';
            }
          });
        }
      };
    }
  ]);