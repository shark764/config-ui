'use strict';

angular.module('liveopsConfigPanel')
  .factory('Notation', ['LiveopsResourceFactory', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, emitInterceptor, cacheAddInterceptor) {

      var Notation = LiveopsResourceFactory.create({
        endpoint: '/v1/notations',
        resourceName: 'Notation',
        updateFields: [{
          name: 'name'
        }, {
          name: 'type'
        }, {
          name: 'category'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'active'
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      return Notation;
    }
  ]);
