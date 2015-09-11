'use strict';

/*global spyOn : false */

describe('cacheRemoveInterceptor service', function(){
  var interceptor,
    $rootScope;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['cacheRemoveInterceptor', '$rootScope', function(cacheRemoveInterceptor, _$rootScope) {
    interceptor = cacheRemoveInterceptor;
    $rootScope = _$rootScope;
  }]));
  
  describe('response function', function(){
    it('should remove the resource from the stored array in the cache', inject(['queryCache', function(queryCache) {
      var MyResource = function(id){
        this.id = id;
      };
      MyResource.prototype.resourceName = 'myResource';
      var myResource = new MyResource('myid');
      
      var cachedArr = [{id: '1'}, {id: 2}, myResource];
      spyOn(queryCache, 'get').and.returnValue(cachedArr);
      
      interceptor.response({
          resource: myResource
      });
      expect(cachedArr.length).toBe(2);
    }]));
    
    it('should do nothing if there is no cached array', inject(['queryCache', function(queryCache) {
      var MyResource = function(id){
        this.id = id;
      };
      MyResource.prototype.resourceName = 'myResource';
      var myResource = new MyResource('myid');

      spyOn(queryCache, 'get');
      
      var response = {
          resource: myResource
      };
      
      var result = interceptor.response(response);
      expect(result).toBe(myResource);
    }]));
  });
});
