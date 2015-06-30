'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUserGroups', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/users/:memberId/groups', null);

  }]);
