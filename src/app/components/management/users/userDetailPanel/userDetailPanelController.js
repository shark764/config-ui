'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserDetailPanelController', ['$scope', '$window', '$parse', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole', 'queryCache', '$timeout',
    function($scope, $window, $parse, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole, queryCache, $timeout) {
      var self = this;

      $scope.scenario = function() {
        if (!$scope.selectedTenantUser) {
          return;
        }

        if ($scope.selectedTenantUser.$user.isNew()) {
          return 'invite:new:user';
        } else if ($scope.selectedTenantUser.isNew()) {
          return 'invite:existing:user';
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
        var wasNew = $scope.selectedTenantUser.isNew();
        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          tenantUser.$user = user;

          //TODO remove once TITAN2-2890 is resolved
          return TenantUser.get({
            tenantId: Session.tenant.tenantId,
            id: tenantUser.userId
          }).$promise.then(function(tenantUser) {
            tenantUser.$user = user;

            tenantUser.$original.roleName = TenantRole.getName(tenantUser.roleId);
            
            tenantUser.reset();
            
            if(wasNew) {
              $scope.fetchTenantUsers().push(tenantUser);
            }

            return tenantUser;
          });
        });
      };

      this.saveNewUserTenantUser = function() {
        $scope.selectedTenantUser.$user.email = $scope.selectedTenantUser.email;
        return $scope.selectedTenantUser.$user.save().then(function(user) {
          $scope.selectedTenantUser.$busy = true; //TODO: remove setting busy once TITAN2-2881 is addressed
          return $timeout(function() { //TODO: remove timeout once TITAN2-2881 is addressed
            return $scope.selectedTenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function(tenantUser) {
              tenantUser.$user = user;
              tenantUser.id = user.id;
              tenantUser.$original.skills = [];
              tenantUser.$original.groups = [{}];

              tenantUser.$original.roleName = TenantRole.getName(tenantUser.roleId);
              
              tenantUser.reset();

              $scope.fetchTenantUsers().push(tenantUser);
              $scope.$emit('resource:details:tenantUser:create:success', $scope.selectedTenantUser);
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
    }
  ]);
