'use strict';

angular.module('liveopsConfigPanel')
  .directive('userManagmentMenu', function () {
      return {
        restrict: 'E',
        scope: {
          menuLocked: '='
        },
        templateUrl: 'app/shared/directives/userManagmentMenu/userManagmentMenu.html',
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
