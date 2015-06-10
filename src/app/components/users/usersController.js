'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', 'userStates', 'userStatuses', 'userRoles', 'User', 'Session', 'userTableConfig', 'userSidebarConfig',
    function($scope, userStates, userStatuses, userRoles, User, Session, userTableConfig, userSidebarConfig) {
      $scope.states = userStates;
      $scope.statuses = userStatuses;
      $scope.filteredUsers = [];
      $scope.Session = Session;

      $scope.additional = {
        states: userStates,
        roles: userRoles
      };

      $scope.users = User.query();

      $scope.createUser = function() {
        $scope.selectedUser = new User({
          status: true,
          state: 'Ready'
        });
      };

      $scope.sidebarConfig = userSidebarConfig;
      $scope.tableConfig = userTableConfig;
    }
  ]);
