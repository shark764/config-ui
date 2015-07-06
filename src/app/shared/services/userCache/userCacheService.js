'use strict';

angular.module('liveopsConfigPanel')
  .service('UserCache', ['$q', 'User', 'UUIDCache', 'Session',
    function ($q, User, UUIDCache, Session) {
      this.get = function (id, success, failure) {
        var deferred = $q.defer();
        if (id) {
          var cached = UUIDCache.get(id);
          if (cached) {
            deferred.resolve(cached);

            if(success) {
              success(cached);
            }

            return angular.extend({
              $promise: deferred.promise,
            }, cached);
          } else {
            return User.get({
              id: id,
              tenantId: Session.tenant.tenantId
            }, function (user) {
              if (success) {
                success(user);
              }

              UUIDCache.put(id, {
                id: user.id,
                displayName: user.displayName
              });
            }, function(error) {
              if (failure) {
                failure(error);
              }
            });
          }
        }

        deferred.reject('id_not_set');
        return {
          $promise: deferred.promise
        };
      };
    }]);
