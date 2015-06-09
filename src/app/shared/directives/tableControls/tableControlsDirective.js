'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$filter', '$location', function ($filter, $location) {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        config: '=',
        items: '=',
        onCreateClick: '=',
        selected: '=',
        resourceName: '@'
      },
      templateUrl: 'app/shared/directives/tableControls/tableControls.html',
      link: function ($scope) {
        $scope.columns = {
          options: []
        };
        angular.forEach($scope.config.fields, function (field) {
          $scope.columns.options.push({
            display: field.header,
            value: field.name,
            checked: !field.checked
          });
        });

        var refresh = function () {
          $scope.filteredItems = $scope.items;
          angular.forEach($scope.config.fields, function (field) {
            if (!field.filter) {
              return;
            }
            $scope.filteredItems = $filter(field.filter)($scope.filteredItems, field);
          });

          $scope.filteredItems = $filter('search')(
            $scope.filteredItems,
            $scope.config.search.fields,
            $scope.searchQuery);

          //Only replace the selected user if the old one got excluded via filtering.
          // if ($scope.filteredItems.indexOf($scope.selected) === -1) {
          //   $scope.selected = $scope.filteredItems[0];
          // }
        };

        $scope.$on('filter:changed', refresh);
        $scope.$watch('searchQuery', refresh);
        $scope.$watchCollection('items', refresh);

        $scope.selectItem = function (item) {
          $scope.selected = item;
          $location.search({
            id: item.id
          });
        };

        $scope.$on('created:resource:' + $scope.resourceName, function (event, item) {
          $scope.items.push(item);
        });

        $scope.filteredItems = $scope.items;
      }
    };
  }]);