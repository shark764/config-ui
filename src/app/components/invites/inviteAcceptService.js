'use strict';

angular.module('liveopsConfigPanel')
  .factory('InviteAccept', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/invites/:userId/accept', true, false, []);
  }]);

