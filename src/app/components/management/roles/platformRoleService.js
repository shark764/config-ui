'use strict';

angular.module('liveopsConfigPanel')
  .factory('PlatformRole', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {
      var PlatformRole = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/roles:id',
        resourceName: 'PlatformRole',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'permissions',
          optional: true
        }]
      });

      PlatformRole.prototype.getDisplay = function() {
        return this.name;
      };

      PlatformRole.getName = function(roleId) {
        return PlatformRole.cachedGet({
          id: roleId
        }).name;
      };

      return PlatformRole;
    }
  ]);
