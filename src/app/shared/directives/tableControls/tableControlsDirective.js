'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$filter', '$location', '$stateParams', function ($filter, $location, $stateParams) {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        config: '=',
        items: '=',
        onCreateClick: '=',
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
            id: item.id
          });
        };

        $scope.$on('created:resource:' + $scope.resourceName, function (event, item) {
          $scope.items.push(item);
          $scope.selected = item;
        });

        $scope.$watchCollection('filtered', function () {
          if($scope.filtered.length > 0 && (!$scope.selected || $scope.filtered.indexOf($scope.selected) == -1)) {
            $scope.selected = $scope.filtered[0];
          }
        });
      }
    };
  }]);
