'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', 'userRoles', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole',
    function($scope, $window, userRoles, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole) {
      var self = this;
      $scope.Session = Session;
      $scope.roles = userRoles;
      $scope.tenantUserParams = {
        status: 'pending'
      };

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

      $scope.fetchTenantUsers = function () {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.fetchTenantRoles = function() {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      }

      $scope.create = function() {
        $scope.selectedTenantUser = new TenantUser({
          status: 'pending'
        });
      };
      
      Chain.create('user:save', function() {
        var user = new User($scope.selectedTenantUser);
        
        return user.save().then(function(user) {
          angular.extend($scope.selectedTenantUser, user);
          
          var tenantUser = new TenantUser({
            email: user.email,
            status: $scope.tenantUserParams.status,
            roleId: $scope.tenantUserParams.roleId
          });
          
          return tenantUser.save({
            tenantId: Session.tenant.tenantId,
          });
        });
      });
      
      Chain.create('user:update', function() {
        var user = new User($scope.selectedTenantUser);
        
        return user.save().then(function(user) {
          angular.extend($scope.selectedTenantUser, user);
          return user;
        });
      });
      
      Chain.create('tenant:user:save', function() {
        return $scope.selectedTenantUser.save();
      });

      //Various navigation rules
      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });

      // $scope.$on('table:on:click:actions', function () {
      //   $scope.showBulkActions = true;
      // });

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
