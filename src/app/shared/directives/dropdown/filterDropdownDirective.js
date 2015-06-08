'use strict';

angular.module('liveopsConfigPanel')
  .directive('filterDropdown', [function () {
    return {
      scope: {
        id: '@',
        field: '=',
        label: '@'
      },
      templateUrl: 'app/shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link: function ($scope) {
        $scope.allFilter = {checked: true};
        
        $scope.$watch('field.options', function (option) {
          $scope.$emit('filter:changed');
        }, true);
        
        $scope.$watch('allFilter', function(all) {
          if(!$scope.field){
            return;
          }
          
          angular.forEach($scope.field.options.options, function (option) {
            option.checked = all.checked;
          });
        }, true);
      }
    };
  }]);