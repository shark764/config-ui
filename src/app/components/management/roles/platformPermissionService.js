'use strict';

angular.module('liveopsConfigPanel')
  .factory('PlatformPermission', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {
      var PlatformPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/permissions/:id',
        resourceName: 'PlatformPermission',
        updateFields: []
      });

      PlatformPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return PlatformPermission;
    }
  ]);
