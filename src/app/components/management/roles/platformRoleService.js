'use strict';

angular.module('liveopsConfigPanel')
  .factory('PlatformRole', ['LiveopsResourceFactory', 'Session',
    function(LiveopsResourceFactory, Session) {
      var PlatformRole = LiveopsResourceFactory.create({
        endpoint: '/v1/roles:id',
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
