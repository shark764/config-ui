'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', 'Session', function ($scope, Session) {
    $scope.menuCollapsed = Session.collapseSideMenu;
  }]);
