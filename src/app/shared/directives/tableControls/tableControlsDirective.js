'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$rootScope', '$filter', '$location', '$stateParams', '$parse', 'DirtyForms',
    function ($rootScope, $filter, $location, $stateParams, $parse, DirtyForms) {
      return {
        restrict: 'E',
        scope: {
          id: '@',
          config: '=',
          items: '=',
          selected: '=',
          extendScope: '=',
          resourceName: '@'
        },
        templateUrl: 'app/shared/directives/tableControls/tableControls.html',
        transclude: true,
        controller: function () {},
        link: function ($scope) {
          $scope.$watch('config', function(){
            $scope.showBulkActions = angular.isDefined($scope.config.showBulkActions) ? $scope.config.showBulkActions : true;
            $scope.showCreate = angular.isDefined($scope.config.showCreate) ? $scope.config.showCreate : true;
            
            $scope.reverseSortOrder = false;
            $scope.orderBy = $scope.config.orderBy;
          });
          
          angular.extend($scope, $scope.extendScope);
          
          $scope.$on('created:resource:' + $scope.resourceName,
            function (event, item) {
              $scope.items.push(item);
              $scope.selected = item;
              $location.search({
                id: item.id
              });
          });

          $scope.onCreateClick = function () {
            DirtyForms.confirmIfDirty(function () {
              $rootScope.$broadcast('table:on:click:create');
            });
          };

          $scope.onActionsClick = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.selected = undefined;
              $rootScope.$broadcast('table:on:click:actions');
            });
          };

          $scope.selectItem = function (item) {
            DirtyForms.confirmIfDirty(function () {
              $scope.selected = item;

              if (item) {
                $location.search({
                  id: item.id
                });
              }

              $rootScope.$broadcast('table:resource:selected', item);
            });
          };

          $scope.checkItem = function (item, value) {
            var newValue = angular.isDefined(value) ? value : !item.checked;

            if (item.checked !== newValue) {
              item.checked = newValue;
              $rootScope.$broadcast('table:resource:checked', item);
            }
          };

          $scope.parse = function (item, field) {
            if (field.resolve) {
              return field.resolve(item);
            } else if (field.name) {
              var parseFunc = $parse(field.name);
              return parseFunc(item);
            }
          };

          $scope.isResolved = function (item) {
            return angular.isUndefined(item.$resolved) || item.$resolved;
          };

          $scope.toggleAll = function (checkedValue) {
            angular.forEach($scope.filtered, function (item) {
              $scope.checkItem(item, checkedValue);
            });
          };

          //TODO: Run this again if the selected tenant changes?
          if ($scope.items) {
            $scope.items.$promise.then(function () {
              if ($scope.items.length === 0) {
                $rootScope.$broadcast('resource:create');
              } else if ($stateParams.id) {
                //Init the selected item based on URL param
                var matchedItems = $filter('filter')($scope.items, {
                  id: $stateParams.id
                }, true);
                if (matchedItems.length > 0) {
                  $scope.selectItem(matchedItems[0]);
                  return;
                } else {
                  $scope.selected = $scope.selectItem(null);
                }
              }
            });
          }

          $scope.$watchCollection('filtered', function () {
            if (!$scope.items || !$scope.items.$resolved) {
              $scope.selectItem(null);
              return;
            }

            if ($scope.filtered.length === 0) {
              $rootScope.$broadcast('resource:create');
              return;
            }

            //Swap the selection if the selected item gets filtered out
            var selectedIsVisible = false;
            if ($scope.selected) {
              var matchedItems = $filter('filter')($scope.filtered, {
                id: $scope.selected.id
              }, true);
              if (matchedItems.length > 0) {
                selectedIsVisible = true;
              }
            }

            if (!selectedIsVisible) {
              $scope.selectItem(null);
            }

            //Uncheck rows that have been filtered out
            angular.forEach($scope.items, function (item) {
              if (item.checked && $scope.filtered.indexOf(item) < 0) {
                item.checked = false;
              }
            });
          });

          $scope.sortTable = function (field) {
            var fieldName;
            if (field.sortOn) {
              fieldName = field.sortOn;
            } else if (field.name) {
              fieldName = field.name;
            }

            if (fieldName === $scope.orderBy) {
              $scope.reverseSortOrder = !$scope.reverseSortOrder;
            } else {
              $scope.reverseSortOrder = false;
            }

            $scope.orderBy = fieldName;
          };
        }
      };
    }
  ]);