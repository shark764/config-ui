'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain',
    function ($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Invite, Alert, flowSetup, BulkAction, $q, $location, _, Chain) {
      var self = this;
      $scope.forms = {};
      $scope.Session = Session;
      $scope.roles = userRoles;
      $scope.invite = new Invite({})

      $window.flowSetup = flowSetup;

      $scope.newPassword = null;

      User.prototype.preUpdate = function () {
        if (this.password) {
          $scope.newPassword = this.password;
        }
      };

      User.prototype.postUpdate = function (result) {
        if (this.id === Session.user.id && $scope.newPassword) {
          var token = AuthService.generateToken(this.email, $scope.newPassword);
          Session.setUser(this);
          Session.setToken(token);
          $scope.newPassword = null;
        }

        return result;
      };

      User.prototype.postCreate = function (result) {
        $scope.sendInvite(this.email);

        return result;
      };

      $scope.fetchUsers = function () {
        $scope.users = User.query({
          tenantId: Session.tenant.tenantId
        });

        return $scope.users;
      };


      var userSaveChain = Chain.get('user:save');
      var inviteChain = Chain.get('user:tenant:invite');

      userSaveChain.register('save', function () {
        return $scope.save();
      }, 0);

      inviteChain.register('invite', function () {
        return $scope.inviteUser();
      }, 0);

      $scope.create = function () {
        $scope.selectedUser = new User({
          status: 'enabled'
        });
      };

      //Various navigation rules
      $scope.$on('table:on:click:create', function () {
        $scope.showBulkActions = false;
        $scope.create();
      });

      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });

      $scope.save = function () {
        if(!$scope.selectedUser.id){
          $scope.selectedUser.status = 'pending';
        }

        return $scope.selectedUser.save().then(function (user) {
          $scope.resetForm();
          return user;
        });
      };

      $scope.inviteUser = function () {
        return $scope.sendInvite($scope.forms.detailsForm.email.$viewValue).then(function (invite) {
          var user = _.find($scope.users, {id: invite.invitation.userId});

          if(user) {
            $scope.selectedUser = user;
          } else {
            return User.get({id : invite.invitation.userId}).$promise.then(function (user) {
              $scope.users.add(user);
              $scope.selectedUser = user;
            });
          }
        });
      };

      $scope.sendInvite = function (email) {
        $scope.invite.email = email;
        $scope.roleId = '00000000-0000-0000-0000-000000000000';
        $scope.tenantId = Session.tenant.tenantId;

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
