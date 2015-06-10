'use strict';

angular.module('liveopsConfigPanel')
  .directive('managementMenu', function () {
      return {
        restrict: 'AE',
        scope: {
          menuLocked: '=',
          menuConfig: '='
        },
        templateUrl: 'app/shared/directives/managementMenu/managementMenu.html',
        link: function($scope){
          $scope.collapsed = ! $scope.menuLocked;

          $scope.mouseleave = function(){
            if (! $scope.menuLocked){
              $scope.collapsed = true;
            }
          };
        }
      };
  });
