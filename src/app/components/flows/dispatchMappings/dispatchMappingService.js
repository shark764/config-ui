'use strict';

angular.module('liveopsConfigPanel')
  .factory('DispatchMapping', ['LiveopsResourceFactory', 'emitInterceptor',
    function (LiveopsResourceFactory, emitInterceptor) {

      var DispatchMapping = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/dispatch-mappings/:id',
        resourceName: 'DispatchMapping',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'value',
          optional: true
        }, {
          name: 'flowId',
          optional: true
        }, {
          name: 'channelType',
          optional: true
        }, {
          name: 'interactionField',
          optional: true
        }, {
          name: 'active',
          optional: true
        }],
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      DispatchMapping.prototype.getDisplay = function () {
        return this.name;
      };

      return DispatchMapping;
    }
  ]);