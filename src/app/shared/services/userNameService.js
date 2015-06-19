'use strict';

angular.module('liveopsConfigPanel')
  .service('UserName', ['User', 'UUIDCache', function (User, UUIDCache) {
    this.get = function (id, callback) {
      if (id){
        var cached = UUIDCache.get(id);
        if (cached){
          if (typeof callback !== 'undefined'){
            callback(cached);
          }
          
          return cached;
        } else {
          return User.get({id: id}, function(data){
            UUIDCache.put(id, data);
            if (typeof callback !== 'undefined'){
              callback(data);
            }
          });
        }
      }

      //Return nothing if not supplied with the id.
      return;
    };
  }]);

