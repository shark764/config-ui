'use strict';

angular.module('liveopsConfigPanel')
  .factory('Integration', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Integration = LiveopsResourceFactory.create('/v1/tenants/:tenantId/integrations/:id', [
      {name: 'properties'},
      // {name: 'type'},
      {name: 'active'}
    ]);
    
    Integration.prototype.getDisplay = function () {
      return this.type;
    };
    
    Integration.resourceName = 'Integration';
    return Integration;
  }]);

