'use strict';

angular.module('liveopsConfigPanel')
  .factory('FlowDraft', ['LiveopsResourceFactory', 'emitInterceptor',
    function (LiveopsResourceFactory, emitInterceptor) {

      var FlowDraft = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/flows/:flowId/drafts/:id',
        resourceName: 'FlowDraft',
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
        }, {
          name: 'history'
        }],
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      FlowDraft.prototype.getDisplay = function () {
        return this.name;
      };

      return FlowDraft;
    }
  ]);