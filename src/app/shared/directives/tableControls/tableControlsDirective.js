'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$rootScope', '$filter', '$location', '$stateParams', '$parse', 'DirtyForms',
    function($rootScope, $filter, $location, $stateParams, $parse, DirtyForms) {
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
        link: function($scope) {
          angular.extend($scope, $scope.extendScope);

          $scope.$on('resource:details:' + $scope.resourceName + ':create:success', function(event, item) {
            $scope.items.push(item);
            $scope.selectItem(item);
          });

          $scope.onCreateClick = function() {
            DirtyForms.confirmIfDirty(function(){
              $rootScope.$broadcast('on:click:create');
            });
          };
          
          $scope.onActionsClick = function() {
            DirtyForms.confirmIfDirty(function(){
              $rootScope.$broadcast('on:click:actions');
            });
          };

          $scope.selectItem = function(item) {
            DirtyForms.confirmIfDirty(function(){
              $scope.selected = item;

              if (item) {
                $location.search({id: item.id});
              }

              $scope.$emit('resource:selected', item);
            });
          };

          $scope.checkItem = function(item, value) {
            var newValue = angular.isDefined(value) ? value : !item.checked;

            if(item.checked !== newValue) {
              item.checked = newValue;
              $scope.$emit('resource:checked', item);
            }
          };

          $scope.parse = function(item, field) {
            if (typeof(field.name) === 'function') {
              return field.name(item);
            } else if (typeof(field.name) === 'string') {
              var parseFunc = $parse(field.name);
              return parseFunc(item);
            }
          };

          $scope.toggleAll = function(checkedValue) {
            angular.forEach($scope.filtered, function(item) {
              $scope.checkItem(item, checkedValue);
            });
          };

          if ($scope.items) {
            $scope.items.$promise.then(function() {
              if ($scope.items.length === 0){
                $rootScope.$broadcast('resource:create');
              } else if ($stateParams.id) {
              //Init the selected item based on URL param
                var matchedItems = $filter('filter')($scope.items, {
                  id: $stateParams.id
                }, true);
                if (matchedItems.length > 0) {
                  $scope.selected = matchedItems[0];
                  return;
                }
              }
            });
          }

          $scope.$watchCollection('filtered', function() {
            if (!$scope.items || !$scope.items.$resolved){
              $scope.selectItem(null);
              return;
            }

            if ($scope.filtered.length === 0){
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
              $scope.selectItem($scope.filtered[0]);
            }

            //Uncheck rows that have been filtered out
            angular.forEach($scope.items, function(item) {
              if (item.checked && $scope.filtered.indexOf(item) < 0) {
                item.checked = false;
              }
            });
          });
        }
      };
    }
  ]);
