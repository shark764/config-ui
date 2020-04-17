'use strict';

angular.module('liveopsConfigPanel')
  /** lo-resource-table element directive
   * Monster component to generate a sortable, filterable, scrollable full-page table of elements
   *
   * Note: Uses 100% height, thus requiring that its parent has a defined height
   *
   * Accepted config values:
   * * fields (array of objects): The config items for the columns. Config for headers accepts:
   *     - checked (boolean): Whether to show the column. Defaults to true
   *     - resolve (function): Optional function to generate the table cell content. The resolve function will be passed the row item. Expected to return a string.
   *     - transclude (boolean): Whether to use transcluded content for the table cell content. (See 'name')
   *     - name (string): If transclude is false, the property of the item that will be displayed in the table cell.
   *                      If transclude is true, the name attribute of the transcluded element to use as the table cell contents
   *     - sortOn (string): What property to be used when sorting the column. Defaults to the property given by 'name' config value
   *     - filterOrderBy (string): If 'header.options' is defined, optional property used to order the filter-dropdown items. Default ordering is ordered as given by 'header.options'
   *     - header (object): The config for the header of the column
   *         * display (string): The column title. Defaults to undefined
   *         * options (object or function): Optional config options that are passed to filter-dropdown
   *                                         If function, the function will be evaluated and the return value will be passed as config options to filter-dropdown
   *         * valuePath (string): Property path to get the filter-dropdown item values. See filter-dropdown directive
   *         * displayPath (string) Property path to get the filter-dropdown item labels. See filter-dropdown directive
   * * searchOn (array of strings or objects): Array of strings gives property names. Array of objects like:
   *      [{
   *         path: 'skills',
   *         inner: {
   *           path: 'name'
   *         }
   *       }]
   *     can search complex object like {description: 'The Platform User', skills: [{id: 1234, name: 'Skill 1'}, {id: 5432, name: 'A Skill'}]}
   *     See 'search' filter for more info
   *  * greaterOrLessThan (object): The config of the greaterOrLessThan filter:
   *      - display (string): The title of the button
   *      - path (string): The property to be used by the filter
   *      - units (array of objects): Optional list of units to be used as a multiplier to the value comparing.
   *        * display (string): Display value of option
   *        * value (string): Multiplier of value when comparing
   *  * orderBy (string): The default property used to order the items. Defaults to undefined, and items are ordered as given by the items attribute
   *  * resourceKey (string): The property on the items to be used as their ID for the URL params. Defaults to 'id'
   *  * reverseSort (boolean): When true, items will be displayed in descending order based on the orderBy field. Defaults to false (items displayed in ascending order)
   *  * showBulkActions (boolean): Whether to show the checkbox column. Defaults to true
   *  * stateKey (string): The name of the URL param that identifies an item. Defaults to 'id'
   *  * sref (string): Optional name of the state to go to when clicking a table row. Defaults to undefined
   */
  .directive('loResourceTable', ['$rootScope', '$filter', '$location', '$parse', 'loEvents', 'DirtyForms', 'Session', '$timeout',
    function($rootScope, $filter, $location, $parse, loEvents, DirtyForms, Session, $timeout) {
      return {
        restrict: 'E',
        scope: {
          config: '=', //Config object. See above for accepted values
          items: '=', //Source list of items to be added to the table
          searchQuery: '=?', // (string) Optional search string passed to search filter for items. Matches determined by 'config.searchOn'
          greaterOrLessThan: '=?', // Optional filter object passed to filter items. Matches determined by 'config.searchOn'
          selected: '=' //Expose the currently selected table item
        },
        templateUrl: 'app/shared/directives/loResourceTable/loResourceTable.html',
        transclude: true,
        controller: ['$scope', function($scope) {
          $scope.toggleToolbarVisibility = function (interactionId) {
            $rootScope.$broadcast('silentMonitoring', interactionId);
          };
        }],
        link: function($scope, element) {
          $scope.customAttributesFields = undefined;
          $scope.forceGlobalLoading = $rootScope.forceGlobalLoading;
          var parseResourceKey = angular.noop;
          var parseStateKey = angular.noop;

          $scope.$watch('config', function(newConfig) {
            if (!newConfig) {
              console.warn('loResourceTable config is not defined. Value is: ', newConfig);
              return;
            }

            $scope.config.fields.forEach(function (field) {
              if(field.subMenu && field.header.options) {
                // custom-attributes fields should be displayed only when the main custom-attributes filter is checked in the table-controls
                $scope.isCustomAttrFieldsChecked = field.checked;
                // assign current logged in tenant custom-attributes values to customAttributesFields scope variable
                $scope.customAttributesFields = field.header.options;
                $scope.isAnyCustomAttributeChecked = $scope.customAttributesFields.some(function(option) {
                  return option.checked === true;
                });
              }
            });
            $scope.showBulkActions = angular.isDefined($scope.config.showBulkActions) ? $scope.config.showBulkActions : true;
            $scope.reverseSortOrder = $scope.config.reverseSort;
            $scope.orderBy = $scope.config.orderBy;
            $scope.resourceKey = $scope.config.resourceKey ? $scope.config.resourceKey : 'id';
            $scope.stateKey = $scope.config.stateKey ? $scope.config.stateKey : 'id';

            //Function for getting the id values out of object maps
            parseResourceKey = $parse($scope.resourceKey);
            parseStateKey = $parse($scope.stateKey);
          }, true);

          $scope.$watch('customAttributesFields', function(newFields, prevFields) {
            if(!$scope.removingDuplicateFilter) {
              // look for the custom-attribute whose searchValue has been changed from the previous update
              var searchField = $scope.customAttributesFields && $scope.customAttributesFields.find(function(newField) {
                if(newField.checked) {
                  return prevFields && prevFields.find(function(prevField) {
                    return (newField.id === prevField.id && newField.searchValue !== prevField.searchValue);
                  });
                }
              });
              $scope.activeCustomAttrSearchField = (searchField && searchField.searchValue) ? searchField : $scope.activeCustomAttrSearchField;
              if($scope.activeCustomAttrSearchField) {
                filterCustomAttributeItems();
              }
            };
            $scope.removingDuplicateFilter = false;
          }, true);

          $scope.$watch('activeCustomAttrSearchField', function(newAttr, oldAttr) {
            // when a search is performing on top of another search, remove the searchValue from the previous custom-attribute field
            if((newAttr && oldAttr) && (newAttr.id !== oldAttr.id)) {
              $scope.removingDuplicateFilter = true;
              oldAttr.searchValue = '';
            };
          });

          function filterCustomAttributeItems() {
            $scope.items && $scope.items.forEach(function(item) {
              // perform the interaction filter with respect to the active custom-attribute value searchQuery:
              var interactionIncludesAttributeInSearch = item.customAttributes && item.customAttributes.find(function(atr) {
                return (atr && atr.attributeEntityId === $scope.activeCustomAttrSearchField.id);
              });
              // if the interaction includes activeCustomAttrSearchField, perform the search: 
              if(interactionIncludesAttributeInSearch && interactionIncludesAttributeInSearch.value) {
                var searchValueExists = interactionIncludesAttributeInSearch.value.join().toString().replace(/,/g, '').toLowerCase().includes($scope.activeCustomAttrSearchField.searchValue.toLowerCase());
                item.checked = searchValueExists ? true : false;
              } else {
                // if the interaction doesnot includes activeCustomAttrSearchField, then hide the interaction:
                var searchValue = $scope.activeCustomAttrSearchField.searchValue;
                item.checked = (!searchValue || searchValue === '--') ? true : false;
              }
            });
          };

          $scope.openSearchInput = function(option) {
            if(!option.showSearchInpt) {
              $timeout(function() {
                var input = element.find('.field-header-input');
                input.focus();
              });
            };
            option.showSearchInpt = !option.showSearchInpt;
          };

          $scope.$on('created:resource', function(event, item) {
            if ($scope.selected && item && item.id === $scope.selected.id){
              var params = {};
              params[$scope.stateKey] = parseResourceKey(item);
              $location.search(params);
            }
          });

          $scope.onSelectItem = function(item) {
            if(!$scope.config.freezeState){
              DirtyForms.confirmIfDirty(function() {
                $scope.selectItem(item);
              });
            }
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
            if (field.subMenuHeaders) {
              var attribute = item.customAttributes && item.customAttributes.find(function(atr) {
                return field.id === atr.attributeEntityId;
              });
              return attribute ? attribute.value.sort().join(', ') : '--';
            }
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
            // interactions which have custom-attributes should be filtered by the input searchValue
            if($scope.config.preferenceKey === 'interactionsInQueueList' && $scope.activeCustomAttrSearchField) {
              filterCustomAttributeItems();
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
        }
      };
    }
  ]);
