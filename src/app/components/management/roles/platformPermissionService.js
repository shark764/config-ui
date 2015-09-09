'use strict';

angular.module('liveopsConfigPanel')
  .factory('PlatformPermission', ['LiveopsResourceFactory',
    function(LiveopsResourceFactory) {
      var PlatformPermission = LiveopsResourceFactory.create({
        endpoint: '/v1/permissions/:id',
        resourceName: 'PlatformPermission',
        updateFields: []
      });

      PlatformPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return PlatformPermission;
    }
  ]);
