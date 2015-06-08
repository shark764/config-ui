'use strict';

angular.module('liveopsConfigPanel')
  .directive('filterDropdown', [function () {
    return {
      scope: {
        id: '@',
        options: '=',
        valuePath: '@',
        displayPath: '@',
        label: '@',
        showAll: '@'
      },
      templateUrl: 'app/shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link: function ($scope) {
        $scope.valuePath = $scope.valuePath ? $scope.valuePath : 'value';
        $scope.displayPath = $scope.displayPath ? $scope.displayPath : 'display';
        
        $scope.allFilter = {checked: true};
        
        $scope.$watch('options', function (option) {
          $scope.$emit('filter:changed');
        }, true);
        
        $scope.$watch('allFilter', function(all) {
          if(!$scope.options){
            return;
          }
          
          angular.forEach($scope.options, function (option) {
            option.checked = all.checked;
          });
        }, true);
      }
    };
  }]);