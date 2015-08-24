'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', '$parse', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole', 'queryCache',
    function($scope, $window, $parse, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole, queryCache) {
      var self = this;
      
      $scope.forms = {};
      $scope.Session = Session;
      $window.flowSetup = flowSetup;
      $scope.tableConfig = userTableConfig;

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

      $scope.create = function() {
        $scope.selectedTenantUser = new TenantUser();
        $scope.selectedTenantUser.$user = new User();
      };

      $scope.submit = function() {
        var scenario = $scope.scenario();

        if (scenario.indexOf('invite:existing') === 0) {
          return self.saveNewTenantUser();
        } else if (scenario === 'invite:new:user') {
          return self.saveNewUserTenantUser();
        } else if (scenario === 'update') {
          return self.updateUser();
        }
      };
      
      //TODO cleanup these functions. Lots of room to combine code.
      this.saveTenantUser = function () {
        $scope.selectedTenantUser.status = 'invited';
        
        var backup = {
          $user: $scope.selectedTenantUser.$user,
          skills: $scope.selectedTenantUser.skills,
          groups: $scope.selectedTenantUser.groups
        };
        
        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          tenantUser.$user = backup.$user;
          
          tenantUser.$original.roleName = TenantRole.getName(tenantUser.roleId);
          tenantUser.$original.skills = backup.skills;
          tenantUser.$original.groups = backup.groups;
          tenantUser.$original.id = tenantUser.userId;
          
          tenantUser.reset();
          return tenantUser;
        }).then(function() {
          Alert.success('Invite Sent');
        }, function() {
          Alert.failure('Error occured. Invite not sent.');
        });
      };
      
      this.saveNewTenantUser = function() {
        var user = $scope.selectedTenantUser.$user;
        
        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(tenantUser) {
          tenantUser.$user = user;
          return TenantUser.get({
            tenantId: Session.tenant.tenantId,
            id: tenantUser.userId
          }).$promise.then(function(tenantUser) {
            $scope.selectedTenantUser = tenantUser;
            $scope.fetchTenantUsers().push(tenantUser);
            
            //TODO remove once roleName comes back on GET /v1/tenants/tenant-id/users/user-id
            tenantUser.$original.roleName = TenantRole.getName(tenantUser.roleId);
            tenantUser.reset();
            
            return tenantUser;
          });
        });
      };

      this.saveNewUserTenantUser = function() {
        $scope.selectedTenantUser.$user.email = $scope.selectedTenantUser.email;
        return $scope.selectedTenantUser.$user.save().then(function(user) {
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

            return tenantUser;
          });
        });
      };

      this.updateUser = function() {
     
        var promises = [];
        if($scope.forms.detailsForm.roleId &&
          $scope.forms.detailsForm.roleId.$dirty) {
          var tenantUser = new TenantUser({
            id: $scope.selectedTenantUser.id,
            roleId: $scope.selectedTenantUser.roleId
          });
          
          promises.push(tenantUser.save({
            tenantId: Session.tenant.tenantId
          }).then(function(tenantUser) {
            $scope.selectedTenantUser.$original.roleId = tenantUser.roleId;
            $scope.selectedTenantUser.$original.roleName = TenantRole.getName(tenantUser.roleId);
            $scope.selectedTenantUser.reset();
          }));
        }
        
        promises.push($scope.selectedTenantUser.$user.save());
        
        return $q.all(promises);
      };
      
      $scope.saveTenantUser = this.saveTenantUser;
      
      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });
      
      //TODO revisit this.
      $scope.$on('email:validator:found', function(event, tenantUser) {
        $scope.selectedTenantUser = tenantUser;
      });

      $scope.bulkActions = {
        setStatus: new BulkAction(),
        resetPassword: new BulkAction(),
        userSkills: new BulkAction(),
        userGroups: new BulkAction()
      };
    }
  ]);
