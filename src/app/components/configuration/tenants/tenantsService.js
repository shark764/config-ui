'use strict';

angular.module('liveopsConfigPanel')
  .factory('Tenant', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'status'},
      {name: 'adminUserId'}
    ]);
  }]);

