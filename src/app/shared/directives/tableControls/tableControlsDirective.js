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

        $scope.selectItem = function (item) {
          $scope.selected = item;
          $location.search({
            id: item.id
          });
        };

        //Init the selected item based on URL param
        $scope.items.$promise.then(function(){
          if($stateParams.id){
            var matchedItems = $filter('filter')($scope.items, {id : $stateParams.id}, true);
            if (matchedItems.length > 0){
              $scope.selected = matchedItems[0];
              return;
            }
          }
          
          $scope.selected = $scope.filtered[0];
        });
        
        $scope.$on('created:resource:' + $scope.resourceName, function (event, item) {
          $scope.items.push(item);
          $scope.selectItem(item);
        });

        $scope.$watchCollection('filtered', function () {
          if(! $scope.filtered.length){
            return;
          }
          
          var selectedIsVisible = false;
          if ($scope.selected){
            var matchedItems = $filter('filter')($scope.filtered, {id : $scope.selected.id}, true);
            if (matchedItems.length > 0){
              selectedIsVisible = true;
            }
          }

          if(! selectedIsVisible) {
            $scope.selectItem($scope.filtered[0]);
          }
        });
      }
    };
  }]);
