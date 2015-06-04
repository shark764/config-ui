'use strict';

angular.module('liveopsConfigPanel')
  .factory('FlowsService', ['ServiceFactory', function (ServiceFactory) {

    return ServiceFactory.create('/v1/tenants/:tenantId/flows/:flowId', true, false);
  }]);

