'use strict';

angular.module('liveopsConfigPanel')
  .directive('managementMenu', ['Session', function (Session) {
      return {
        restrict: 'AE',
        scope: {
          menuLocked: '=',
          menuConfig: '='
        },
        templateUrl: 'app/shared/directives/managementMenu/managementMenu.html',
        link: function($scope){
          $scope.collapsed = ! $scope.menuLocked;

          $scope.lockMenu = function () {
            $scope.menuLocked = true;
            Session.lockSideMenu = $scope.menuLocked;
            Session.flush();
          };

          $scope.unlockMenu = function () {
            $scope.menuLocked = false;
            Session.lockSideMenu = $scope.menuLocked;
            Session.flush();
          };

          $scope.mouseleave = function(){
            if (! $scope.menuLocked){
              $scope.collapsed = true;
            }
          };
        }
      };
  }]);
