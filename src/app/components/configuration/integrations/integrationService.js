'use strict';

angular.module('liveopsConfigPanel')
  .factory('Integration', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Integration = LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:tenantId/integrations/:id',
      resourceName: 'Integration',
      updateFields: [{name: 'properties'},
        // {name: 'type'},
        {name: 'active'}
    ]});
    
    Integration.prototype.getDisplay = function () {
      return this.type;
    };
    
    return Integration;
  }]);

