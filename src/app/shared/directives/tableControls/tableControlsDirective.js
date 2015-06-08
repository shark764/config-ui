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
        onSelect: '='
      },
      templateUrl: 'app/shared/directives/tableControls/tableControls.html',
      link: function ($scope) {
        $scope.columns = { options: [] };
        angular.forEach($scope.config.fields, function(field) {
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
        };

        $scope.$on('filter:changed', refresh);
        $scope.$watch('searchQuery', refresh);
        $scope.$watchCollection('items', refresh);

        $scope.filteredItems = $scope.items;
      }
    };
  }]);