'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$location', 'userStatuses', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig',
    function($scope, $location, userStatuses, userRoles, User, Session, AuthService, userTableConfig) {
      $scope.states = userStates;
      $scope.statuses = userStatuses;
      $scope.filteredUsers = [];
      $scope.Session = Session;
      
      var newPassword;
      var preSave = function(scope) {
        if(scope.resource.password){
          newPassword = scope.resource.password
        }
      }
      
      var postSave = function(scope, result){
        if(result.id === Session.user.id && newPassword) {
          var token = AuthService.generateToken(
            result.email, newPassword);
          Session.setUser(scope.resource);
          Session.setToken(token);
          newPassword = null;
        }
      };
      
      $scope.additional = {
        preSave: preSave,
        postSave: postSave,
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
