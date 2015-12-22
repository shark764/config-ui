'use strict';

angular.module('liveopsConfigPanel')
  .factory('Region', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/regions/:id',
        resourceName: 'Region'
      });
    }
  ]);
