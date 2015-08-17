'use strict';

angular.module('liveopsConfigPanel')
  .factory('Flow', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Flow = LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:tenantId/flows/:id',
      resourceName: 'Flow',
      updateFields: [
        {name: 'name'},
        {name: 'description', optional: true},
        {name: 'activeVersion'},
        {name: 'channelType', optional: true},
        {name: 'type'},
        {name: 'active'}
      ]
   });
    
    Flow.prototype.getDisplay = function () {
      return this.name;
    };
    
    return Flow;
  }]);

