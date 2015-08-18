'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', '$parse', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'Chain', 'TenantUser', 'TenantRole', 'queryCache', '$timeout',
    function($scope, $window, $parse, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, Chain, TenantUser, TenantRole, queryCache, $timeout) {
      var self = this;

      $scope.Session = Session;
      $window.flowSetup = flowSetup;
      $scope.tableConfig = userTableConfig;

      $scope.fetchTenantUsers = function() {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.create = function() {
        $scope.selectedTenantUser = new TenantUser();
        $scope.selectedTenantUser.$user = new User();
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
