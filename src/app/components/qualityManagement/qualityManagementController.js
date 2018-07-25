'use strict';

angular.module('liveopsConfigPanel')
  .controller('qualityManagementController', ['$scope', '$state', '$sce', 'qualityManagementUrl', 'Session', 'UserPermissions',
    function ($scope, $state, $sce, qualityManagementUrl, Session, UserPermissions) {
      // Redirecting to user page if user has not permissions, this avoid
      // errors in case of switching between tenants
      if (!UserPermissions.hasPermission('QM_ENABLE')) {
        if (UserPermissions.hasPermissionInList(['MANAGE_ALL_SKILLS', 'MANAGE_ALL_GROUPS'])) {
          $state.go('content.management.users', {
            messageKey: 'permissions.unauthorized.message'
          });
        } else {
          $state.go('content.userprofile', {
            messageKey: 'permissions.unauthorized.message'
          });
        }
      }
      $scope.qualityManagementUrl = $sce.trustAsResourceUrl(qualityManagementUrl + '/wfo?token=' + Session.token + '&tenantId=' + Session.tenant.tenantId + '&page=Dashboard');
    }
  ]);
