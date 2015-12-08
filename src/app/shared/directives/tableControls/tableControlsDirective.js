'use strict';

angular.module('liveopsConfigPanel')
  //Accepted config values:
  // * fields (array of objects): The config items for the columns. Config for headers accepts:
  //    - checked (boolean): Whether to show the column. Defaults to true
  //    - resolve (function): Optional function to generate the table cell content
  //    - transclude (boolean): Whether to use transcluded content for the table cell content
  //    - name (string): If transclude is false, the property of the item that is displayed in the table cell. 
  //                     If transclude is true, the name attribute of the transcluded element to use as the table cell contents
  //    - sortOn (string): What property to be used when sorting the column. Defaults to the value of 'name' config value
  //    - filterOrderBy (string): Optional property used to order the filter-dropdown items
  //    - header (object): The config for the header of the column
  //        * display (string): The column title. Defaults to ''
  //        * options (object or function): Optional config options that are passed to the filter-dropdown. 
  //                                        If function, function will be called and expected to return a filter-dropdown config
  //        * valuePath (string): Property path to get the filter-dropdown item values
  //        * displayPath (string) Property path to get the filter-dropdown item labels
  //        *
  // * helpLink (string): The URL for the help link icon. Defaults to '' and is hidden.
  // * orderBy (string): The default property used to order the items. Defaults to ''
  // * resourceKey (string): The property on the items to be used as their ID for the URL params. Defaults to 'id'
  // * showBulkActions (boolean): Whether to show the 'Actions' button and checkbox column. Defaults to true
  // * showCreate (boolean): Whether to show the 'Create' button. Defaults to true
  // * stateKey (string): The name of the URL param that identifies an item. Defaults to 'id'
  // * searchOn (array of strings or objects): Array of strings gives property names. Array of objects like:
  //     [{
  //        path: 'skills',
  //        inner: {
  //          path: 'name'
  //        }
  //      }]
  //    can search complex object like {skills: [{id: 1234, name: 'Skill 1'}, {id: 5432, name: 'A Skill'}]}
  // * sref (string): Name of the state to go to when clicking a table row. Defaults to ''
  // * title (string): The title of the page. Also used as the key for storing the user's column preferences. Defaults to ''

  .directive('tableControls', ['$rootScope', '$filter', '$location', '$parse', 'loEvents', 'DirtyForms', 'Session',
    function($rootScope, $filter, $location, $parse, loEvents, DirtyForms, Session) {
      return {
        restrict: 'E',
        scope: {
          id: '@',
          config: '=',
          items: '=',
          selected: '=',
          resourceName: '@'
        },
        templateUrl: 'app/shared/directives/tableControls/tableControls.html',
        transclude: true,
        controller: function() {},
        link: function($scope) {
          var parseResourceKey = angular.noop;
          var parseStateKey = angular.noop;

          $scope.$watch('config', function(newConfig) {
            if (!newConfig) {
              console.warn('Table config is not defined. Value is: ', newConfig);
              return;
            }

            $scope.showBulkActions = angular.isDefined($scope.config.showBulkActions) ? $scope.config.showBulkActions : true;
            $scope.showSearch = angular.isDefined($scope.config.showSearch) ? $scope.config.showSearch : true;
            $scope.showCreate = angular.isDefined($scope.config.showCreate) ? $scope.config.showCreate : true;

            $scope.reverseSortOrder = false;
            $scope.orderBy = $scope.config.orderBy;

            $scope.resourceKey = $scope.config.resourceKey ? $scope.config.resourceKey : 'id';
            $scope.stateKey = $scope.config.stateKey ? $scope.config.stateKey : 'id';

            //Function for getting the id values out of object maps
            parseResourceKey = $parse($scope.resourceKey);
            parseStateKey = $parse($scope.stateKey);
          });

          $scope.$on('created:resource:' + $scope.resourceName,
            function(event, item) {
              //Select the newly created item and set the URL param
              $scope.selected = item;

              var params = {};
              params[$scope.stateKey] = parseResourceKey(item);
              $location.search(params);
            });

          $scope.$on('dropdown:item:checked', function() {
            //Save the user's preferred column config
            var columnPreferences = Session.columnPreferences;
            columnPreferences[$scope.config.title] = $scope.config.fields;
            Session.setColumnPreferences(columnPreferences);
          });

          $scope.onCreateClick = function() {
            DirtyForms.confirmIfDirty(function() {
              $rootScope.$broadcast(loEvents.tableControls.itemCreate);
            });
          };

          $scope.onActionsClick = function() {
            DirtyForms.confirmIfDirty(function() {
              $scope.selected = undefined; //Hide the right panel
              $rootScope.$broadcast(loEvents.tableControls.actions);
            });
          };

          $scope.onSelectItem = function(item) {
            DirtyForms.confirmIfDirty(function() {
              $scope.selectItem(item);
            });
          };

          $scope.selectItem = function(item) {
            if (item) {
              //Set the URL param to the newly selected item
              var params = $scope.stateParam(item);
              $location.search(params);
            }

            //Broadcast the selected event with the newly selected item, and the previously selected item
            $rootScope.$broadcast(loEvents.tableControls.itemSelected, item, $scope.selected);
            $scope.selected = item;
          };

          $scope.checkItem = function(item, value) {
            var newValue = angular.isDefined(value) ? value : !item.checked;

            if (item.checked !== newValue) {
              item.checked = newValue;
              $rootScope.$broadcast(loEvents.tableControls.itemChecked, item);
            }
          };

          $scope.parse = function(item, field) {
            if (field.resolve) {
              return field.resolve(item);
            } else if (field.name) {
              var parseFunc = $parse(field.name);
              return parseFunc(item);
            }
          };

          $scope.stateParam = function(item) {
            var param = {};
            param[$scope.stateKey] = parseResourceKey(item);
            return param;
          };

          $scope.toggleAll = function(checkedValue) {
            angular.forEach($scope.filtered, function(item) {
              $scope.checkItem(item, checkedValue);
            });
          };

          $scope.$watchCollection('items', function(newItems) {
            if (!$scope.items || ($scope.items.$promise && !$scope.items.$resolved)) {
              return;
            }

            if (parseStateKey($location.search())) { //If the item id URL param exists
              //Init the selected item based on URL param
              var params = {};
              params[$scope.resourceKey] = parseStateKey($location.search());
              var matchedItems = $filter('filter')(newItems, params, false);

              if (matchedItems.length > 0) {
                $scope.selectItem(matchedItems[0]);
                return;
              } else {
                $scope.selected = $scope.selectItem(null);
              }
            }
          });

          $scope.$watchCollection('filtered', function() {
            if (!$scope.items || ($scope.items.$promise && !$scope.items.$resolved)) {
              $scope.selectItem(null);
              return;
            }

            //Uncheck rows that have been filtered out
            angular.forEach($scope.items, function(item) {
              if (item.checked && $scope.filtered.indexOf(item) < 0) {
                item.checked = false;
              }
            });
          });

          $scope.sortTable = function(field) {
            var fieldName;
            if (field.sortOn) {
              fieldName = field.sortOn;
            } else if (field.name) { //Default to sorting on 'name' property
              fieldName = field.name;
            }

            if (fieldName === $scope.orderBy) {
              $scope.reverseSortOrder = !$scope.reverseSortOrder;
            } else {
              $scope.reverseSortOrder = false;
            }

            $scope.orderBy = fieldName;
          };

          $scope.clearAllFilters = function() {
            $scope.searchQuery = null;

            angular.forEach($scope.config.fields, function(field) {
              if (field.header.options) {
                var options = $filter('invoke')(field.header.options);
                angular.forEach(options, function(option) {
                  option.checked = true;
                });
              }
            });
          };

          $scope.getFields = function() {
            if (!$scope.config || !$scope.config.fields) {
              console.warn('tableControls config.fields is not defined. Value is: ', $scope.config.fields);
              return;
            }

            for (var fieldIndex = 0; fieldIndex < $scope.config.fields.length; fieldIndex++) {
              if (Session.columnPreferences[$scope.config.title]) {
                //Initialize the user's preferred column configuration
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
