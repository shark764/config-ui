'use strict';

angular.module('liveopsConfigPanel')
	.controller('UsersController', ['$scope', 'Session', 'UserService', '$filter', function($scope, Session, UserService, $filter) {
    $scope.selectedUser = null;

  }]);

