'use strict';

angular.module('liveopsConfigPanel')
  .directive('userManagmentMenu', ['Session', function (Session) {
      return {
        restrict: 'E',
        scope: {
          collapsed: '='
        },
        templateUrl: 'app/shared/directives/userManagmentMenu/userManagmentMenu.html',
        link : function($scope){
          $scope.toggleCollapse = function(){
            $scope.collapsed = !$scope.collapsed;
            Session.collapseSideMenu = $scope.collapsed;
          };
        }
      };
  }]);
