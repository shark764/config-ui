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

      $scope.users = User.query(function() {
        if ($routeParams.id) {
        var activeUser = $filter('filter')($scope.users, {
          id: $routeParams.id
        }, true);

        $scope.selectedUser = activeUser;
      }
    });

      $scope.$watchCollection('filteredUsers', function(newList) {
      //Only replace the selected user if the old one got excluded via filtering.
        if (newList && newList.indexOf($scope.selectedUser) === -1) {
        $scope.selectedUser = $scope.filteredUsers[0];
      }
    });

      $scope.$on('created:resource:user', function (user) {
        $scope.users.push(user);
      });

      $scope.selectUser = function(user) {
      $scope.selectedUser = user;
      $location.search({
        id: user.id
      });
    };

      $scope.createUser = function() {
        $scope.selectedUser = new User({
          status: true,
          state: 'Ready'
        });
      };
      
      $scope.config = userTableConfig;
    }
  ]);
