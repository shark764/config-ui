'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', '$parse', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole', 'queryCache', '$timeout',
    function($scope, $window, $parse, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole, queryCache, $timeout) {
      var self = this;

      $scope.Session = Session;
      $scope.forms = {};
      $window.flowSetup = flowSetup;
      $scope.tableConfig = userTableConfig;

      $scope.scenario = function() {
        if (!$scope.selectedTenantUser) {
          return null;
        }

        if ($scope.selectedTenantUser.$user.isNew()) {
          if ($parse('forms.detailsForm.email.$error.duplicateEmail')($scope)) {
            return 'invite:existing:user:not:in:tenant';
          } else {
            return 'invite:new:user';
          }
        } else if ($parse('forms.detailsForm.email.$error.duplicateEmail')($scope)) {
          return 'invite:existing:user:in:tenant';
        } else {
          return 'update';
        }
      };

      $scope.fetchTenantUsers = function() {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchTenantRoles = function() {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.create = function() {
        $scope.selectedTenantUser = new TenantUser();
        $scope.selectedTenantUser.$user = new User();
      };

      $scope.submit = function() {
        var scenario = $scope.scenario();

        if (scenario.indexOf('invite:existing') === 0) {
          return self.updateTenantUser();
        } else if (scenario === 'invite:new:user') {
          return self.saveNewUserTenantUser();
        } else if (scenario === 'update') {
          return self.updateUser();
        }
      };

      this.updateTenantUser = function() {
        var user = $scope.selectedTenantUser.$user;
        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          tenantUser.$user = user;

          //TODO log API bug where roleName isn't comming back on get
          return TenantUser.get({
            tenantId: Session.tenant.tenantId,
            id: tenantUser.userId
          }).$promise.then(function(tenantUser) {
            tenantUser.$user = user;

            tenantUser.$original.roleName = TenantRole.getName(tenantUser.roleId);

            tenantUser.reset();

            $scope.fetchTenantUsers().push(tenantUser);

            return tenantUser;
          });
        });
      };

      this.saveNewUserTenantUser = function() {
        $scope.selectedTenantUser.$user.email = $scope.selectedTenantUser.email;
        return $scope.selectedTenantUser.$user.save().then(function(user) {
          $scope.selectedTenantUser.$busy = true; //TODO: remove timeout once TITAN2-2881 is addressed
          return $timeout(function() { //TODO: remove timeout once TITAN2-2881 is addressed
            return $scope.selectedTenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function(tenantUser) {
              tenantUser.$user = user;
              tenantUser.$original.skills = [];
              tenantUser.$original.groups = [{}];

              tenantUser.$original.roleName = TenantRole.getName(tenantUser.roleId);

              tenantUser.reset();

              return tenantUser;
            });
          }, 3000);
        });
      };

      this.updateUser = function() {
        var oldPassword = this.password;
        return $scope.selectedTenantUser.$user.save().then(function(user) {
          if (user.id === Session.user.id) {
            var token = AuthService.generateToken(user.email, oldPassword);
            Session.setUser(user);
            Session.setToken(token);
            $scope.newPassword = null;
          }

          return user;
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });

      $scope.bulkActions = {
        setStatus: new BulkAction(),
        resetPassword: new BulkAction(),
        userSkills: new BulkAction(),
        userGroups: new BulkAction()
      };
    }
  ]);
