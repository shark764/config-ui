'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'Alert', 'flowSetup', 'BulkAction', 'TenantUser', '$q', '$location', 'lodash', 'Chain',
    function($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Invite, Alert, flowSetup, BulkAction, TenantUser, $q, $location, _, Chain) {
      var self = this;
      $scope.Session = Session;
      $scope.roles = userRoles;
      $scope.invite = new Invite();

      $window.flowSetup = flowSetup;

      $scope.newPassword = null;

      User.prototype.preUpdate = function() {
        if (this.password) {
          $scope.newPassword = this.password;
        }
      };

      User.prototype.postUpdate = function(result) {
        if (this.id === Session.user.id && $scope.newPassword) {
          var token = AuthService.generateToken(this.email, $scope.newPassword);
          Session.setUser(this);
          Session.setToken(token);
          $scope.newPassword = null;
        }

        return result;
      };

      User.prototype.postCreate = function(result) {
        $scope.sendInvite(this.email);

        return result;
      };

      $scope.fetchTenantUsers = function() {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      var userSaveChain = Chain.get('user:save');
      var inviteChain = Chain.get('user:tenant:invite');

      userSaveChain.hook('save', function() {
        return $scope.save();
      }, 0);

      inviteChain.hook('invite', function() {
        return $scope.inviteUser();
      }, 0);

      $scope.create = function() {
        $scope.selectedUser = new User({
          status: 'enabled'
        });
      };

      //Various navigation rules
      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });

      $scope.$on('table:resource:selected', function(event, selectedItem) {
        if (selectedItem !== null && angular.isDefined(selectedItem)) {
          //TODO: yuck! Remove when TITAN2-2413 branch (which changes user panel) is merged
          $scope.selectedUser = new User(selectedItem);
        }
      });

      //TODO: Aurrgghhh
      // $scope.$on('resource:details:user:create:success', function (event, createdItem) {
      //   event.defaultPrevented = true;
      //
      //   var newTenantUser = new TenantUser(createdItem);
      //   newTenantUser.skills = [];
      //   newTenantUser.groups = [];
      //   $scope.fetchTenantUsers().push(newTenantUser);
      //   $scope.selectedUser = newTenantUser;
      // });

      //TODO: FFFFFFFFUUUUU
      // $scope.$on('resource:details:user:update:success', function (event, updatedItem) {
      //   event.defaultPrevented = true;
      //   var users = $scope.fetchTenantUsers();
      //
      //   for (var i = 0; i < users.length; i++){
      //     if (users[i].id === updatedItem.id){
      //       angular.copy(updatedItem, users[i]);
      //       break;
      //     }
      //   }
      // });

      // $scope.$on('table:on:click:actions', function () {
      //   $scope.showBulkActions = true;
      // });

      $scope.save = function() {
        if (!$scope.selectedUser.id) {
          $scope.selectedUser.status = 'pending';
        }

        return $scope.selectedUser.save();
      };

      $scope.inviteUser = function() {
        return $scope.sendInvite($scope.selectedUser.email).then(function(invite) {
          var user = _.find($scope.users, {
            id: invite.invitation.userId
          });

          if (user) {
            $scope.selectedUser = user;
          } else {
            return User.get({
              id: invite.invitation.userId
            }).$promise.then(function(user) {
              $scope.users.push(user);
              $scope.selectedUser = user;

              return invite;
            });
          }

          return invite;
        });
      };

      $scope.sendInvite = function(email) {
        $scope.invite = new Invite({});

        $scope.invite.email = email;
        $scope.invite.roleId = '00000000-0000-0000-0000-000000000000';
        $scope.invite.tenantId = Session.tenant.tenantId;

        return $scope.invite.save();
      };

      $scope.tableConfig = userTableConfig;

      $scope.bulkActions = {
        setStatus: new BulkAction(),
        resetPassword: new BulkAction(),
        userSkills: new BulkAction(),
        userGroups: new BulkAction()
      };

      $scope.$watch('Session.tenant.tenantId', $scope.fetchUsers);
    }
  ]);
