'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', 'userStatuses', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'toastr',
    function($scope, userStatuses, userRoles, User, Session, AuthService, userTableConfig, Invite, toastr) {
      $scope.statuses = userStatuses;
      $scope.filteredUsers = [];
      $scope.Session = Session;

      var newPassword;
      var preSave = function(scope) {
        if(scope.resource.password){
          newPassword = scope.resource.password;
        }
      };

      var postSave = function(scope, result){
        if(result.id === Session.user.id && newPassword) {
          var token = AuthService.generateToken(
            result.email, newPassword);
          Session.setUser(scope.resource);
          Session.setToken(token);
          newPassword = null;
        }

        Invite.save({tenantId: Session.tenant.tenantId}, {email : result.email, roleId : '00000000-0000-0000-0000-000000000000'} ); //TEMPORARY roleId
      };

      var postError = function(scope, error){
        if (error.config.method === 'POST' && error.status === 400){
          toastr.clear();
          toastr.success('User already exists. Sending ' + scope.resource.email + ' an invite for ' + Session.tenant.name, '', {timeout: 5000});
          Invite.save({tenantId: Session.tenant.tenantId}, {email : scope.resource.email, roleId : '00000000-0000-0000-0000-000000000000'} ); //TEMPORARY roleId
          scope.cancel();
        }
      };

      $scope.additional = {
        preSave: preSave,
        postSave: postSave,
        postError: postError,
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
