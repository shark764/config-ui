'use strict';

angular.module('liveopsConfigPanel')
  .factory('Queue', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Queue = LiveopsResourceFactory.create('/v1/tenants/:tenantId/queues/:id', 'Queue', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'activeVersion', optional: true},
      {name: 'active'}
    ]);
    
    Queue.prototype.getDisplay = function () {
      return this.name;
    };
    
    return Queue;
  }]);

