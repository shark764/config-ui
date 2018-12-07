'use strict';

angular.module('liveopsConfigPanel')
  /** table-controls element directive
   * Component to generate set of controls for a resource table, including search bar, create buttons, actions buttons, columns filter, and title
   *
   * Accepted config values:
   * * fields (array of objects): The config items for the columns. Config for headers accepts:
   *     - checked (boolean): Whether to show the column. Defaults to true
   *     - header (object): The config for the header of the column
   *         * display (string): The column title. Defaults to undefined
   *
   *  * helpLink (string): The URL for the help link icon. Defaults to undefined, and the help icon is hidden.
   *  * showBulkActions (boolean): Whether to show the 'Actions' button and checkbox column. Defaults to true
   *  * showCreate (boolean): Whether to show the 'Create' button. Defaults to true
   *  * showSearch (boolean) Whether to show the search bar. Defaults to true
   *  * title (string): The title of the page. Also used as the key for storing the user's column preferences. Defaults to undefined
   */

  .directive('tableControls', ['$rootScope', 'loEvents', 'DirtyForms', 'Session', '$q',
    function($rootScope, loEvents, DirtyForms, Session, $q) {
      return {
        restrict: 'E',
        scope: {
          config: '=', //Config object. See above for accepted values
          items: '=', //Source list of items to be added to the table
          searchQuery: '=', //Expose the text entered in the search bar
          greaterOrLessThan: '=?', //Expose the greaterOrLessThan inputs
          selectedItem: '=', // gives us data from the currently selected row
          bypassFilter: '='
        },
        templateUrl: 'app/shared/directives/tableControls/tableControls.html',
        transclude: true,
        controller: function() {},
        link: function($scope) {

          function setColumnPreferences () {
            var preferenceKey = $scope.config.preferenceKey ? $scope.config.preferenceKey : $scope.config.title;
            var columnPreferences = Session.columnPreferences;

            columnPreferences[preferenceKey] = $scope.config.fields;
            delete columnPreferences['false'];
            Session.setColumnPreferences(columnPreferences);
          }

          function validateColumnPreferenceCache (preferenceKey) {
            var existing = Session.columnPreferences[preferenceKey].map(function(field){
              return field.name;
            }).sort();
            var newest = $scope.config.fields.map(function(field){
              return field.name;
            }).sort();

            if (!_.isEqual(existing, newest)) {
              var diffs = _.difference(existing, newest);
              Session.columnPreferences[preferenceKey].forEach(function(field, index, table){
                if (_.includes(diffs, field.name)) {
                  table.splice(index, 1);
                  Session.flush();
                }
              })
            }
          }

          $scope.$watch('config', function(newConfig) {
            if (!newConfig) {
              console.warn('Table-controls config is not defined. Value is: ', newConfig);
              return;
            }

            $scope.showBulkActions = angular.isDefined($scope.config.showBulkActions) ? $scope.config.showBulkActions : true;
            $scope.showSearch = angular.isDefined($scope.config.showSearch) ? $scope.config.showSearch : true;
            $scope.showCreate = angular.isDefined($scope.config.showCreate) ? $scope.config.showCreate : true;
            $scope.showColumns = angular.isDefined($scope.config.showColumns) ? $scope.config.showColumns : true;

            if ($scope.config.greaterOrLessThan) {
              $scope.greaterOrLessThan = {
                'comparison': '>'
              };
              if ($scope.config.greaterOrLessThan.units) {
                $scope.greaterOrLessThan.unit = $scope.config.greaterOrLessThan.units[0];
              }
            }
          });

          $scope.$on('dropdown:item:checked', function() {
            setColumnPreferences();
          });

          $scope.$on('dropdown:item:checkedUncheckedAll', function (event, emmittedData) {
            $q.when(emmittedData).then(function () {
              setColumnPreferences();
            });
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

          $scope.getFields = function() {
            if (!$scope.config || !$scope.config.fields) {
              console.warn('tableControls config.fields is not defined. Value is: ', $scope.config.fields);
              return;
            }

            var preferenceKey = $scope.config.preferenceKey ? $scope.config.preferenceKey : $scope.config.title;

            for (var fieldIndex = 0; fieldIndex < $scope.config.fields.length; fieldIndex++) {

              //If for whatever reason options get added without a checked property
              //add it and default it to true.
              if ($scope.config.fields[fieldIndex].header && $scope.config.fields[fieldIndex].header.options) {
                _.forEach($scope.config.fields[fieldIndex].header.options, function(option){
                  if (!_.has(option, 'checked')) {
                    option.checked = true;
                  }
                });
              }

              if (preferenceKey !== 'false' && Session.columnPreferences[preferenceKey]) {
                //Initialize the user's preferred column configuration

                validateColumnPreferenceCache(preferenceKey);

                for (var storeOptionIndex = 0; storeOptionIndex < Session.columnPreferences[preferenceKey].length; storeOptionIndex++) {
                  var storedOption = Session.columnPreferences[preferenceKey][storeOptionIndex];
                  if (_.has(storedOption, 'header.display') &&  ($scope.config.fields[fieldIndex].header.display === storedOption.header.display)) {
                    $scope.config.fields[fieldIndex].checked = (angular.isUndefined(storedOption.checked) ? true : storedOption.checked);
                  }
                }
              } else {
                setColumnPreferences();
              }
            }

            return $scope.config.fields;
          };
        }
      };
    }
  ]);
