'use strict';

angular.module('liveopsConfigPanel')
  .factory('Invite', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/invites/:verb');
  }]);

