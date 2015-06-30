'use strict';

angular.module('liveopsConfigPanel')
.directive('resizable', [function () {
  return {
    restrict: 'A',
    scope: {},
    link: function ($scope, element, attrs) {
      $scope.fieldName = null;
      if ('resizableRight' in attrs){
        $scope.fieldName = 'rightWidth';
      } else if ('resizableLeft' in attrs){
        $scope.fieldName = 'leftWidth';
      }
      
      if ($scope.fieldName){
        $scope.$on('resizehandle:resize', function(event, info){
          if (info[$scope.fieldName] > 700){
            element.addClass('two-col');
          } else {
            element.removeClass('two-col');
          }
          
          if (info[$scope.fieldName] < 450){
            element.addClass('compact-view');
          } else {
            element.removeClass('compact-view');
          }
        });
      }
    }
  };
}]);