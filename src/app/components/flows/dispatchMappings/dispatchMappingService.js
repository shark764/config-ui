'use strict';

angular.module('liveopsConfigPanel')
  .factory('DispatchMapping', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var DispatchMapping = LiveopsResourceFactory.create('/v1/tenants/:tenantId/dispatch-mappings/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'value', optional: true},
      {name: 'flowId', optional: true},
      {name: 'channelType', optional: true},
      {name: 'interactionField', optional: true},
      {name: 'active', optional: true}
    ]);
    
    DispatchMapping.resourceName = 'DispatchMapping';
    
    return DispatchMapping;
  }]);
