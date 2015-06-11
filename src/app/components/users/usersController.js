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

      $scope.sidebarConfig = {
          title: 'Management',
          links: [{
            display: 'Users',
            link: '#/users',
            id: 'user-management-link'
          }, {
            display: 'Groups',
            link: '#/',
            id: 'group-management-link'
          }, {
            display: 'Skills',
            link: '#/',
            id: 'skill-management-link'
          }, {
            display: 'Roles',
            link: '#/',
            id: 'role-management-link'
          }]
      }

      $scope.tableConfig = userTableConfig;
    }
  ]);
