'use strict';

angular.module('liveopsConfigPanel')
  .factory('User', ['LiveopsResourceFactory', 'cacheAddInterceptor', 'emitInterceptor', 'cacheRemoveInterceptor',
    function(LiveopsResourceFactory, cacheAddInterceptor, emitInterceptor, cacheRemoveInterceptor) {
      var User = LiveopsResourceFactory.create({
        endpoint: '/v1/users/:id',
        resourceName: 'User',
        updateFields: [{
          name: 'firstName',
          optional: true
        }, {
          name: 'lastName',
          optional: true
        }, {
          name: 'roleId'
        }, {
          name: 'password'
        }, {
          name: 'externalId',
          optional: true
        }, {
          name: 'personalTelephone',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      User.prototype.getDisplay = function() {
        if (this.firstName || this.lastName) {
          var name = (this.firstName ? this.firstName : '') + ' ' + (this.lastName ? this.lastName : '');
          return name.trim();
        } else if (this.displayName) {
          return this.displayName;
        } else {
          return '';
        }
      };

      return User;
    }
  ]);
