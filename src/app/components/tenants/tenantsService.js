'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantsService', ['AuthenticatedServiceFactory', function (AuthenticatedServiceFactory) {

    return AuthenticatedServiceFactory.create('/v1/tenants/:tenantId', true, false);
  }]);

