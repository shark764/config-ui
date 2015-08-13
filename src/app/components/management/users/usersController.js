'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', '$q', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Invite', 'Alert', 'flowSetup', 'BulkAction', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole', 'tenantUserConverter',
    function ($scope, $window, $q, userRoles, User, Session, AuthService, userTableConfig, Invite, Alert, flowSetup, BulkAction, $location, _, Chain, TenantUser, TenantRole, tenantUserConverter) {
      var self = this;
      $scope.Session = Session;
      $scope.roles = userRoles;
      $scope.forms = {};
      $scope.newPassword = null;
      $window.flowSetup = flowSetup;

      $scope.tableConfig = userTableConfig;

      $scope.scenario = function () {
        if ($scope.selectedTenantUser.isNew()) {
          if ($scope.forms.detailsForm.email.$error.duplicateUsername) {
            return 'invite:existing:user';
          } else {
            return 'invite:new:user';
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
        var user = tenantUserConverter.convert($scope.selectedTenantUser);
        
        var scenario = $scope.scenario();

        if (scenario === 'invite:existing:user') {
          return self.saveTenantUser(user);
        } else if (scenario === 'invite:new:user') {
          return self.saveNewUserTenantUser(user);
        } else if (scenario === 'update') {
          // var tenantUser = new TenantUser({
          //   status: $scope.selectedTenantUser.status
          // });
          // 
          // var update = tenantUser.$update({
          //   tenantId: Session.tenant.tenantId,
          //   id: $scope.selectedTenantUser.id
          // });
          // 
          // return $q.all(update, self.updateUser(user));
          return self.updateUser(user);
        }
      };

      this.saveTenantUser = function (user) {
        var tenantUser = new TenantUser({
          email: user.email,
          status: $scope.selectedTenantUser.status,
          roleId: $scope.selectedTenantUser.roleId
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

      this.saveNewUserTenantUser = function (user) {
        return user.save().then(function (user) {
          tenantUserConverter.convertBack(user, $scope.selectedTenantUser);
          return self.saveTenantUser(user);
        });
      };

      this.updateUser = function (user) {
        return user.save().then(function (user) {
          tenantUserConverter.convertBack(user, $scope.selectedTenantUser);
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