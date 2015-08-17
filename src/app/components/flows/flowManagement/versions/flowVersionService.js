'use strict';

angular.module('liveopsConfigPanel')
  .factory('FlowVersion', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var FlowVersion = LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:tenantId/flows/:flowId/versions/:version',
      resourceName: 'FlowVersion',
      updateFields: [{
        name: 'tenantId'
      }, {
        name: 'name'
      }, {
        name: 'description',
        optional: true
      }, {
        name: 'flowId'
      }, {
        name: 'flow'
      }]
   });

    FlowVersion.prototype.getDisplay = function () {
      return this.name;
    };

    return FlowVersion;
  }]);