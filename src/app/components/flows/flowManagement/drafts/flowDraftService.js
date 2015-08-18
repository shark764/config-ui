'use strict';

angular.module('liveopsConfigPanel')
  .factory('FlowDraft', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var FlowDraft = LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:tenantId/flows/:flowId/drafts/:id',
      resourceName: 'FlowDraft',
      updateFields: [
        {name: 'tenantId'},
        {name: 'name'},
        {name: 'description', optional: true},
        {name: 'flowId'},
        {name: 'flow'},
        {name: 'history'}
    ]});
    
    FlowDraft.prototype.getDisplay = function () {
      return this.name;
    };

    return FlowDraft;
  }]);

