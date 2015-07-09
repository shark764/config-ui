'use strict';

angular.module('liveopsConfigPanel')
  .service('UserCache', ['$q', 'User', 'UUIDCache',
    function ($q, User, UUIDCache) {
      this.get = function (id, success, failure) {
        var deferred = $q.defer();
        if (id) {
          var cached = UUIDCache.get(id);
          if (cached) {
            var userObj = new User(cached); //So fullName function works
            deferred.resolve(userObj);

            if(success) {
              success(cached);
            }

            return angular.extend({
              $promise: deferred.promise,
            }, userObj);
          } else {
            return User.get({
              id: id
            }, function (user) {
              if (success) {
                success(user);
              }

              UUIDCache.put(id, {
                id: user.id,
                displayName: user.displayName,
                firstName: user.firstName,
                lastName: user.lastName
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
