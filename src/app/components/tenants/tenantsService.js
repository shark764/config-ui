'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantsService', ['ServiceFactory', function (ServiceFactory) {

    return ServiceFactory.create('/v1/tenants/:tenantId', true, false);
  }]);

