'use strict';

angular.module('liveopsConfigPanel')
  .service('UserName', ['User', 'UUIDCache', function (User, UUIDCache) {
    this.get = function (id) {
      if (id){
        var cached = UUIDCache.get(id);
        if (cached){
          return cached;
        } else {
          return User.get({id: id}, function(data){
            UUIDCache.put(id, data);
          });
        }
      }
      
      //Return nothing if not supplied with the id.
      return;
    }
  }]);

