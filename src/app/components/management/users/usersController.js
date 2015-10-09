'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', '$parse', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole', 'queryCache', 'UserPermissions', 'PlatformRole', 'TenantUserGroups',
    function($scope, $window, $parse, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole, queryCache, UserPermissions, PlatformRole, TenantUserGroups) {
      var self = this;

      $scope.forms = {};
      $scope.Session = Session;
      $window.flowSetup = flowSetup;
      $scope.userTableConfig = userTableConfig;

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

      $scope.fetchPlatformRoles = function() {
        return PlatformRole.cachedQuery();
      };

      $scope.create = function() {
        $scope.selectedTenantUser = new TenantUser();
        $scope.selectedTenantUser.$user = new User();

        $scope.selectedTenantUser.$skills = [];
        $scope.selectedTenantUser.$groups = [{}];
      };

      var dirty = function(fields) {
        var isDirty = false;
        if(!angular.isArray(fields)) {
          fields = [fields];
        }

        angular.forEach(fields, function(field) {
          if(field in $scope.forms.detailsForm){
            isDirty = isDirty || $scope.forms.detailsForm[field].$dirty
          }
        });

        return isDirty;
      }

      $scope.submit = function() {
        var promises = [];

        if($scope.selectedTenantUser.isNew() || dirty(['status', 'roleId'])) {
          if(!$scope.selectedTenantUser.isNew()) {
            delete $scope.selectedTenantUser.status;
          }

          promises.push($scope.selectedTenantUser.save({
            tenantId: Session.tenant.tenantId
          }));
        }

        if($scope.selectedTenantUser.isNew() ||
          dirty(['firstName', 'lastName', 'externalId'])) {
          $scope.selectedTenantUser.$user.email = $scope.selectedTenantUser.email;
          promises.push($scope.selectedTenantUser.$user.save());
        }

        return $q.all(promises);
      };

      $scope.resend = function() {
        $scope.selectedTenantUser.status = 'invited';

        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function() {
          Alert.success('Invite Sent');
        }, function() {
          Alert.failure('Error occured. Invite not sent.');
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });

      //TODO revisit this.
      $scope.$on('email:validator:found', function(event, tenantUser) {
        $scope.selectedTenantUser = tenantUser;
      });

      $scope.bulkActions = {
        setStatus: new BulkAction(),
        userSkills: new BulkAction(),
        userGroups: new BulkAction()
      };
    }
  ]);
