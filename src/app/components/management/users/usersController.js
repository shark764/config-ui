'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole',
    function ($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Invite, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole) {
      var self = this;
      $scope.Session = Session;
      $scope.roles = userRoles;
      $scope.forms = {};
      $scope.newPassword = null;
      $window.flowSetup = flowSetup;

      $scope.tableConfig = userTableConfig;

      $scope.tenantUserParams = {
        status: 'pending'
      };

      $scope.scenario = function () {
        if ($scope.selectedTenantUser.isNew()) {
          if ($scope.forms.detailsForm.email.$error.duplicateUsername) {
            return 'create:existing:user';
          } else {
            return 'create:new:user';
          }
        } else {
          return 'update';
        }
      };

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

      $scope.fetchTenantUsers = function () {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchTenantRoles = function () {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      }

      $scope.create = function () {
        $scope.selectedTenantUser = new TenantUser({
          status: 'pending'
        });
      };

      $scope.submit = function () {
        var user = new User($scope.selectedTenantUser);
        var scenario = $scope.scenario();

        if (scenario === 'create:existing:user') {
          return $scope.saveTenantUser(user);
        } else if (scenario === 'create:new:user') {
          return $scope.saveNewUserTenantUser(user);
        } else if (scenario === 'update') {
          return $scope.updateUser(user);
        }
      };

      $scope.saveTenantUser = function (user) {
        var tenantUser = new TenantUser({
          email: user.email,
          status: $scope.tenantUserParams.status,
          roleId: $scope.tenantUserParams.roleId
        });

        return tenantUser.save({
          tenantId: Session.tenant.tenantId,
        }).then(function (tenantUser) {
          angular.extend(tenantUser, user);
          tenantUser.skills = [];
          tenantUser.groups = [{}];
          return tenantUser;
        });
      };

      $scope.saveNewUserTenantUser = function (user) {
        return user.save().then(function (user) {
          angular.extend($scope.selectedTenantUser, user);
          return $scope.saveTenantUser(user);
        });
      };

      $scope.updateUser = function (user) {
        return user.save().then(function (user) {
          angular.extend($scope.selectedTenantUser, user);
          return user;
        });
      };

      //Various navigation rules
      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.bulkActions = {
        setStatus: new BulkAction(),
        resetPassword: new BulkAction(),
        userSkills: new BulkAction(),
        userGroups: new BulkAction()
      };

      $scope.$watch('Session.tenant.tenantId', $scope.fetchUsers);
    }
  ]);