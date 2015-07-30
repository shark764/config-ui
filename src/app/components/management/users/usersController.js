'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash',
    function ($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Invite, Alert, flowSetup, BulkAction, $q, $location, _) {
      var self = this;
      $scope.Session = Session;
      $scope.roles = userRoles;

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
        $scope.sendInvite(this.email, $scope.inviteNow);

        return result;
      };

      $scope.fetchUsers = function () {
        $scope.users = User.query({
          tenantId: Session.tenant.tenantId
        });

        return $scope.users;
      };

      $scope.create = function () {
        $scope.selectedUser = new User({
          status: 'enabled'
        });
      };


      // @TODO: Copy-pasta from resource details; remove with Phil's changes
      $scope.resetForm = function () {
        //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
        //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
        angular.forEach($scope.detailsForm, function (value, key) {
          if (value && value.hasOwnProperty('$modelValue') && value.$invalid){
            var displayValue = value.$modelValue;
            if (displayValue === null){
              displayValue = undefined;
            }

            $scope.detailsForm[key].$setViewValue(displayValue);
            $scope.detailsForm[key].$rollbackViewValue();
          }
        });

        $scope.detailsForm.$setPristine();
        $scope.detailsForm.$setUntouched();
      };

      $scope.reset = function () {
        $scope.selectedUser.reset();
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
        $scope.loading = true;

        if(!$scope.selectedUser.id){
          $scope.selectedUser.status = 'pending';
        }

        $scope.selectedUser.save().then(function (user) {
          $scope.resetForm();
          $scope.$broadcast('resource:details:user:create:success', user);
        }).finally(function () {
          $scope.loading = false;
        });
      };

      $scope.inviteUser = function () {
        $scope.loading = true;

        $scope.sendInvite($scope.detailsForm.email.$viewValue, $scope.inviteNow).then(function (invite) {
          $scope.resetForm();
          $scope.loading = false;

          var user = _.find($scope.users, {id: invite.invitation.userId})

          if(user) {
            $scope.selectedUser = user;
          } else {
            return User.get({id : invite.invitation.userId}).$promise.then(function (user) {
              $scope.$broadcast('resource:details:user:create:success', user);
            }).finally(function () {
              $scope.loading = false;
            });
          }
        });
      };

      $scope.sendInvite = function (email, inviteNow) {
        var invite = new Invite({
          email: email,
          roleId: '00000000-0000-0000-0000-000000000000',
          inviteNow: inviteNow,
          tenantId: Session.tenant.tenantId
        });

        return invite.save();
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
