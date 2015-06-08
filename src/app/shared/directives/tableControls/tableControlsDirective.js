'use strict';

angular.module('liveopsConfigPanel')
  .directive('tableControls', ['$filter', function ($filter) {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        config: '=',
        items: '='
      },
      templateUrl: 'app/shared/directives/tableControls/tableControls.html',
      link: function ($scope) {
        $scope.selectItem = function (item) {
          $scope.selectedItem = item;
          $location.search({
            id: user.id
          });

          $scope.$emit($scope.id + ':item:selected', item);
        };
        
        var refresh = function() {
          $scope.filteredItems = $scope.items;
          angular.forEach($scope.config.fields, function(field){
            if(!field.filter){
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