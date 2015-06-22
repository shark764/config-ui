'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$filter', '$location', '$stateParams', '$parse',
    function ($filter, $location, $stateParams, $parse) {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        config: '=',
        items: '=',
        selected: '=',
        resourceName: '@',
        extendScope: '='
      },
      templateUrl: 'app/shared/directives/tableControls/tableControls.html',
      link: function ($scope) {
        angular.extend($scope, $scope.extendScope);

        console.log($scope.items);

        $scope.items.$promise.then(function(data){
          if (data.length === 0){
            $scope.onCreateClick();
          }
        });

        $scope.selectItem = function (item) {
          $scope.selected = item;

          $location.search({
            id: item ? item.id : null
          });

          $scope.$emit('resource:selected', item);
        };

          $scope.onCreateClick = function () {
            $scope.$emit('on:click:create');
          };

          $scope.parse = function (item, field) {
            var parseFunc = $parse(field.name);
            return parseFunc(item);
          };

        //Init the selected item based on URL param
          $scope.items.$promise.then(function () {
            if ($stateParams.id) {
              var matchedItems = $filter('filter')($scope.items, {
                id: $stateParams.id
              }, true);
              if (matchedItems.length > 0) {
              $scope.selected = matchedItems[0];
              return;
            }
          }

          $scope.selected = $scope.filtered[0];
        });


        $scope.$watch('resourceName', function () {
            if ($scope.resourceWatcher) {
            $scope.resourceWatcher();
          }

          $scope.resourceWatcher = $scope.$on('created:resource:' + $scope.resourceName, function (event, item) {
            $scope.items.push(item);
            $scope.selectItem(item);
          });
        });

        $scope.$watchCollection('filtered', function () {
            if ($scope.filtered.length === 0) {
            $scope.selectItem(null);
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
            angular.forEach($scope.items, function (item) {
              if (item.checked && $scope.filtered.indexOf(item) < 0) {
              item.checked = false;
            }
          });
        });

          $scope.toggleAll = function (checkedValue) {
            angular.forEach($scope.filtered, function (item) {
            item.checked = checkedValue;
          });
        };
      }
    };
    }
  ]);