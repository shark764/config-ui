'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$location', '$routeParams', '$filter', 'userStates', 'userStatuses', 'userRoles', 'User', 'Session', 'userTableConfig',
    function($scope, $location, $routeParams, $filter, userStates, userStatuses, userRoles, User, Session, userTableConfig) {
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
      
      $scope.tableConfig = userTableConfig;
    }
  ]);
