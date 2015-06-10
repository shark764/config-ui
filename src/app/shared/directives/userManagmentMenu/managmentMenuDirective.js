'use strict';

angular.module('liveopsConfigPanel')
  .directive('managmentMenu', function () {
      return {
        restrict: 'AE',
        scope: {
          menuLocked: '=',
          templateUrl: '@'
        },
        templateUrl: 'app/shared/directives/userManagmentMenu/managmentMenu.html',
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
