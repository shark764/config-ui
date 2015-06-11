'use strict';

angular.module('liveopsConfigPanel')
  .service('GetInterceptor', ['$q', 'UUIDCache',
    function ($q, UUIDCache) {
      this.request = function (request) {
        if (request.method === 'GET'){
          var itemId = request.url.replace(/^.*[\\\/]/, '');
          var item = UUIDCache.get(itemId);
          
          if (item){
            return item;
          }
        }
        
        return request;
      };
      
      this.response = function (response) {
        if (response.data.id){
          UUIDCache.put(response.data.id, response.data);
        }
        return response;
      };
    }
  ])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('GetInterceptor');
  })
;
