'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$location', '$routeParams', '$filter', 'userStates', 'userStatuses', 'userRoles', 'User', 'Session', 'userTableConfig', 'userSidebarConfig',
    function($scope, $location, $routeParams, $filter, userStates, userStatuses, userRoles, User, Session, userTableConfig, userSidebarConfig) {
      $scope.states = userStates;
      $scope.statuses = userStatuses;
      $scope.filteredUsers = [];
      $scope.Session = Session;

      $scope.additional = {
        states: userStates,
        roles: userRoles,
        updateDisplayName : function($childScope){
          if (!$childScope.resource.id && $childScope.detailsForm.displayName.$untouched){
            var first = $childScope.resource.firstName ? $childScope.resource.firstName : '';
            var last = $childScope.resource.lastName ? $childScope.resource.lastName : '';
            $childScope.resource.displayName = first + ' ' + last;
          }
        }
      };

      $scope.users = User.query();

      $scope.createUser = function() {
        $scope.selectedUser = new User({
          status: true,
          state: 'Ready'
        });
      };

      $scope.tableConfig = userTableConfig;
      $scope.sidebarConfig = userSidebarConfig;
    }
  ]);
