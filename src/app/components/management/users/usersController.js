'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$location', 'userStates', 'userStatuses', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig',
    function($scope, $location, userStates, userStatuses, userRoles, User, Session, AuthService, userTableConfig) {
      $scope.states = userStates;
      $scope.statuses = userStatuses;
      $scope.filteredUsers = [];
      $scope.Session = Session;
      
      var postSave = function(scope){
        if(scope.resource.id === Session.user.id && scope.resource.password) {
          var token = AuthService.generateToken(
            scope.resource.email,
            scope.resource.password);
          Session.setUser(scope.resource);
          Session.setToken(token);
        }
      };
      
      $scope.additional = {
        postSave: postSave,
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

      $scope.createUser = function() {
        $scope.selectedUser = new User({
          status: true
        });
      };

      $scope.users = User.query();
      $scope.tableConfig = userTableConfig;
    }
  ]);
