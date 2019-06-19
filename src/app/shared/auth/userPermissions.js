'use strict';

angular.module('liveopsConfigPanel').service('UserPermissions', [
  'Session',
  '$state',
  '$q',
  '$timeout',
  function(Session, $state, $q, $timeout) {
    var self = this;

    this.hasPermission = function(permissionKey) {
      if (!Session.isAuthenticated()) {
        return false;
      }

      var permissions = [];
      permissions.push.apply(permissions, Session.platformPermissions);
      permissions.push.apply(permissions, Session.tenant.tenantPermissions);

      for (var i = 0; i < permissions.length; i++) {
        if (permissions[i] === permissionKey) {
          return true;
        }
      }

      return false;
    };

    this.hasPermissionInList = function(permissionList) {
      if (!permissionList.length) {
        return true;
      }

      for (var i = 0; i < permissionList.length; i++) {
        if (this.hasPermission(permissionList[i])) {
          return true;
        }
      }

      return false;
    };

    this.resolvePermissions = function(permissionList) {
      var deferred = $q.defer();

      $timeout(function() {
        if (!self.hasPermissionInList(permissionList)) {
          $state.go('content.userprofile', {
            messageKey: 'permissions.unauthorized.message'
          });
          deferred.reject();
        } else {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };
  }
]);
