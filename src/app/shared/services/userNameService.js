'use strict';

angular.module('liveopsConfigPanel')
  .service('UserName', ['User', 'UUIDCache', function (User, UUIDCache) {
    this.get = function (params, success, failure) {
      if (params.id){
        var cached = UUIDCache.get(params.id);
        if (cached){
          return cached;
        } else {
          return User.get(params, function(data, status, headers, config){
            UUIDCache.put(data.id, data);
            if (success){
              success(data, status, headers, config);
            }
          }, failure);
        }
      }
      
      return User.get(params, succcess, failure);
    }
  }]);

