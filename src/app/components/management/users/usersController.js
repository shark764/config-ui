'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain',
    function ($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Invite, Alert, flowSetup, BulkAction, $q, $location, _, Chain) {
      var self = this;
      $scope.forms = {};
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

      userSaveChain.register('save', function () {
        if ($scope.forms.detailsForm.$error.duplicateUsername) {
          return $scope.inviteUser();
        }

        return $scope.save();
      }, 0);

      $scope.create = function () {
        $scope.selectedUser = new User({
          status: 'enabled'
        });
      };


      // @TODO: Copy-pasta from resource details; remove with Phil's changes
      $scope.resetForm = function () {
        //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
        //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
        angular.forEach($scope.forms.detailsForm, function (value, key) {
          if (value && value.hasOwnProperty('$modelValue') && value.$invalid){
            var displayValue = value.$modelValue;
            if (displayValue === null){
              displayValue = undefined;
            }

            $scope.forms.detailsForm[key].$setViewValue(displayValue);
            $scope.forms.detailsForm[key].$rollbackViewValue();
          }
        });

        $scope.forms.detailsForm.$setPristine();
        $scope.forms.detailsForm.$setUntouched();
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
          $scope.resetForm();

          var user = _.find($scope.users, {id: invite.invitation.userId})

          if(user) {
            return user;
          } else {
            return User.get({id : invite.invitation.userId}).$promise.then(function (user) {
              return user;
            });
          }
        });
      };

      $scope.sendInvite = function (email) {
        $scope.invite = new Invite({
          email: email,
          roleId: '00000000-0000-0000-0000-000000000000',
          tenantId: Session.tenant.tenantId
        });

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
