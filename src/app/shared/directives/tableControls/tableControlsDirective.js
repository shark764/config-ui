'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$rootScope', '$filter', '$location', '$stateParams', '$parse', 'loEvents', 'DirtyForms', 'Session',
    function ($rootScope, $filter, $location, $stateParams, $parse, loEvents, DirtyForms, Session) {
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
          var parseResourceKey = angular.noop;
          var parseStateKey = angular.noop;
          
          $scope.$watch('config', function(newConfig){
            if(!newConfig) {
              return;
            }

            $scope.showBulkActions = angular.isDefined($scope.config.showBulkActions) ? $scope.config.showBulkActions : true;
            $scope.showCreate = angular.isDefined($scope.config.showCreate) ? $scope.config.showCreate : true;

            $scope.reverseSortOrder = false;
            $scope.orderBy = $scope.config.orderBy;

            $scope.resourceKey = $scope.config.resourceKey ?
              $scope.config.resourceKey : 'id';
              
            $scope.stateKey = $scope.config.stateKey ?
              $scope.config.stateKey : 'id';
              
            parseResourceKey = $parse($scope.resourceKey);
            parseStateKey = $parse($scope.stateKey);
          });

          angular.extend($scope, $scope.extendScope);

          $scope.$on('created:resource:' + $scope.resourceName,
            function (event, item) {
              $scope.selected = item;
              
              var params = {};
              params[$scope.stateKey] = parseKey(item);
              $location.search(params);
          });

          $scope.$on('dropdown:item:checked', function (){
            var columnPreferences = Session.columnPreferences;
            columnPreferences[$scope.config.title] = $scope.config.fields;
            Session.setColumnPreferences(columnPreferences);
          });

          $scope.onCreateClick = function () {
            DirtyForms.confirmIfDirty(function () {
              $rootScope.$broadcast(loEvents.tableControls.itemCreate);
            });
          };

          $scope.onActionsClick = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.selected = undefined;
              $rootScope.$broadcast(loEvents.tableControls.actions);
            });
          };

          $scope.selectItem = function (item) {
            DirtyForms.confirmIfDirty(function () {
              if (item) {
                var params = {};
                params[$scope.stateKey] = parseResourceKey(item);
                $location.search(params);
              }

              $rootScope.$broadcast(loEvents.tableControls.itemSelected, item, $scope.selected);
              $scope.selected = item;
            });
          };

          $scope.checkItem = function (item, value) {
            var newValue = angular.isDefined(value) ? value : !item.checked;

            if (item.checked !== newValue) {
              item.checked = newValue;
              $rootScope.$broadcast(loEvents.tableControls.itemChecked, item);
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

          $scope.toggleAll = function (checkedValue) {
            angular.forEach($scope.filtered, function (item) {
              $scope.checkItem(item, checkedValue);
            });
          };

          $scope.$watchCollection('items', function(newItems) {
            if(!newItems) {
              return;
            }

            if (newItems.length === 0) {
              $rootScope.$broadcast(loEvents.tableControls.itemCreate);
            } else if (parseStateKey($stateParams)) {
              //Init the selected item based on URL param
              var params = {};
              params[$scope.resourceKey] = parseStateKey($stateParams);
              var matchedItems = $filter('filter')(newItems, params, false);
              
              if (matchedItems.length > 0) {
                $scope.selectItem(matchedItems[0]);
                return;
              } else {
                $scope.selected = $scope.selectItem(null);
              }
            }
          });

          $scope.$watchCollection('filtered', function () {
            if (!$scope.items || ($scope.items.$promise && !$scope.items.$resolved)) {
              $scope.selectItem(null);
              return;
            }

            //Uncheck rows that have been filtered out
            angular.forEach($scope.items, function (item) {
              if (item.checked && $scope.filtered.indexOf(item) < 0) {
                item.checked = false;
              }
            });

            if ($scope.filtered.length === 0) {
              $rootScope.$broadcast(loEvents.tableControls.itemCreate);
              return;
            }

            //Swap the selection if the selected item gets filtered out
            var selectedIsVisible = false;
            if ($scope.selected) {
              var params = {};
              params[$scope.resourceKey] = parseStateKey($stateParams);
              var matchedItems = $filter('filter')($scope.filtered, params);
              
              if (matchedItems.length > 0) {
                selectedIsVisible = true;
              }
            }

            if (!selectedIsVisible) {
              $scope.selectItem(null);
            }
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

          $scope.clearAllFilters = function(){
            $scope.searchQuery = null;

            angular.forEach($scope.config.fields, function(field){
              if (field.header.options){
                var options = $filter('invoke')(field.header.options);
                angular.forEach(options, function(option){
                  option.checked = true;
                });
              }
            });
          };

          $scope.getFields = function(){
            if(!$scope.config || !$scope.config.fields){
              return;
            }

            for (var fieldIndex = 0; fieldIndex < $scope.config.fields.length; fieldIndex++) {
              if (Session.columnPreferences[$scope.config.title]) {
                for (var storeOptionIndex = 0; storeOptionIndex < Session.columnPreferences[$scope.config.title].length; storeOptionIndex++) {
                  var storedOption = Session.columnPreferences[$scope.config.title][storeOptionIndex];
                  if ($scope.config.fields[fieldIndex].header.display === storedOption.header.display) {
                    $scope.config.fields[fieldIndex].checked = (angular.isUndefined(storedOption.checked) ? true : storedOption.checked);
                  }
                }
              }
            }

            return $scope.config.fields;
          };
        }
      };
    }
  ]);
