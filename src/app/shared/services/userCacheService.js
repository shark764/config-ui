'use strict';

angular.module('liveopsConfigPanel')
  .service('UserCache', ['$q', 'User', 'UUIDCache', function ($q, User, UUIDCache) {
    this.get = function (id, callback) {
      var deferred = $q.defer();
      if (id) {
        var cached = UUIDCache.get(id);
        if (cached) {
          deferred.resolve(cached)
          return angular.extend({
            $promise: deferred.promise,
          }, cached);
        } else {
          return User.get({
            id: id
          }, function (user) {
            UUIDCache.put(id, {
              id: user.id,
              displayName: user.displayName
            });
          });
        }
      }
      
      deferred.reject('id_not_set');
      return {
        $promise: deferred.promise
      };
    };
  }]);