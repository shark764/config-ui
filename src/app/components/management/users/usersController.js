'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', '$parse', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole', 'tenantUserConverter', 'queryCache', '$timeout',
    function ($scope, $window, $parse, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole, tenantUserConverter, queryCache, $timeout) {
      var self = this;
    
      $scope.Session = Session;
      $scope.forms = {};
      $scope.ngModels = {};
      $scope.newPassword = null;
      $window.flowSetup = flowSetup;
      $scope.tableConfig = userTableConfig;

      $scope.scenario = function () {
        if(!$scope.selectedTenantUser) {
          return null;
        }
        
        if ($scope.selectedTenantUser.isNew()) {
          if ($parse('forms.detailsForm.email.$error.duplicateUsername')($scope)) {
            return 'invite:existing:user:not:in:tenant';
          } else {
            return 'invite:new:user';
          }
        } else if($parse('forms.detailsForm.email.$error.newTenantUser')($scope)) {
          return 'invite:existing:user:in:tenant';
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
      };

      $scope.create = function () {
        $scope.selectedTenantUser = new TenantUser();
      };

      $scope.submit = function () {
        $scope.selectedTenantUser.$busy = true;
        var user = tenantUserConverter.convert($scope.selectedTenantUser);
        
        var scenario = $scope.scenario();

        if (scenario.indexOf('invite:existing') === 0) {
          return self.updateTenantUser(user);
        } else if (scenario === 'invite:new:user') {
          return self.saveNewUserTenantUser(user);
        } else if (scenario === 'update') {
          return self.updateUser(user);
        }
      };

      this.updateTenantUser = function (user) {
        $scope.selectedTenantUser.email = user.email;
        
        var tenantUser = new TenantUser({
          email: user.email,
          roleId: $scope.selectedTenantUser.roleId,
          status: $scope.selectedTenantUser.status
        });

        return tenantUser.$save({
          tenantId: Session.tenant.tenantId
        }).then(function (tenantUser) {
          $scope.selectedTenantUser.$original.roleId = tenantUser.roleId;
          $scope.selectedTenantUser.$original.status = tenantUser.status;
          
          var role = TenantRole.cachedGet({
            id: $scope.selectedTenantUser.roleId
          });
          
          $scope.selectedTenantUser.$original.roleName = role.name;
          
          $scope.selectedTenantUser.reset();
          
          return tenantUser;
        });
      };

      this.saveNewUserTenantUser = function (user) {
        return user.save().then(function (user) {
          var tenantUser = new TenantUser();
          tenantUser.email = user.email;
          tenantUser.roleId = $scope.selectedTenantUser.roleId;
          tenantUser.status = $scope.selectedTenantUser.status;
          
          $timeout(function(){ //TODO: remove timeout once TITAN2-2881 is addressed
            return tenantUser.$save({
              tenantId: Session.tenant.tenantId
            }).then(function (tenantUser) {
              $scope.selectedTenantUser = tenantUser;
              tenantUserConverter.convertBack(user, tenantUser);
              tenantUser.skills = [];
              tenantUser.groups = [{}];
              return tenantUser;
            });
          }, 3000);
        });
      };

      this.updateUser = function (user) {
        return user.save().then(function (user) {
          tenantUserConverter.convertBack(user, $scope.selectedTenantUser);
          return user;
        });
      };
      
      $scope.$watch('ngModels.email', function(news) {
        if(!news) {
          return;
        }
        
        news.$validators.newTenantUser = function(modelValue) {
          var tenantUsers = $scope.fetchTenantUsers();
          for(var tenantUserIndex = 0; tenantUserIndex < tenantUsers.length; tenantUserIndex++) {
            var tenantUser = tenantUsers[tenantUserIndex];
            if(tenantUser.email === modelValue) {
              angular.copy(tenantUser, $scope.selectedTenantUser);
              return false;
            }
          }
          $scope.selectedTenantUser = new TenantUser({
            email: modelValue,
            roleId: $scope.selectedTenantUser.roleId,
            status: $scope.selectedTenantUser.status
          });
          return false;
        };
      });
      
      $scope.$on('table:on:click:create', function () {
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
