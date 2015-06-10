'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$filter', '$location', '$routeParams', function ($filter, $location, $routeParams) {
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
        $scope.selectItem = function (item) {
          $scope.selected = item;
          $location.search({
            id: item.id
          });
        };

        $scope.$on('created:resource:' + $scope.resourceName, function (event, item) {
          $scope.items.push(item);
          $scope.selected = item;
        });

        $scope.$watchCollection('filtered', function () {
          if(!$scope.selected || $scope.filtered.indexOf($scope.selected) == -1) {
            $scope.selected = $scope.filtered[0];
          }
        });
      }
    };
  }]);
