'use strict';

angular.module('liveopsConfigPanel')
  .factory('Integration', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Integration = LiveopsResourceFactory.create('/v1/tenants/:tenantId/integrations/:id', [
      {name: 'properties'},
      // {name: 'type'},
      {name: 'status'}
    ]);
    
    Integration.prototype.getDisplay = function () {
      return this.type;
    };
    
    Integration.prototype.resourceName = 'Integration';
    return Integration;
  }]);

