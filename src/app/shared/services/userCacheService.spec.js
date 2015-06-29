'use strict';

/*global spyOn, jasmine : false */

describe('UserCache service', function(){
  var UserCache,
      cacheSpy,
      userSpy,
      userGet,
      cacheGet;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  
  describe('cached calls', function(){
    beforeEach(inject(['UUIDCache', 'UserCache', function(UUIDCache, _UserCache_) {
      cacheGet = function(id){
        var user = {name: 'cached user', id: id};
        return user;
      };
      
      cacheSpy = spyOn(UUIDCache, 'get').and.callFake(cacheGet);
      UserCache = _UserCache_;
    }]));

    it('should throw an error if not given an id', inject(['$rootScope', '$httpBackend', 'apiHostname', function($rootScope, $httpBackend, apiHostname) {
      //So digest() will work, which is needed to resolve the .then()
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{}]}); 
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {}});
      
      var successSpy = jasmine.createSpy('success');
      var failSpy = jasmine.createSpy('fail').and.callFake(function(error){
        expect(error).toEqual('id_not_set');
      });
      
      UserCache.get().$promise.then(successSpy, failSpy);
      $rootScope.$digest();
      
      expect(successSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
      $httpBackend.flush();
    }]));
    
    it('should check the cache for the given id', inject(function() {
      UserCache.get(5);
      expect(cacheSpy).toHaveBeenCalledWith(5);
    }));
    
    it('should return the cache value if it is defined', inject(function() {
      expect(UserCache.get(5).name).toEqual('cached user');
    }));
  });
  
  describe('uncached calls', function(){
    beforeEach(inject(['User', 'UUIDCache', 'UserCache', function(User, UUIDCache, _UserCache_) {
      userGet = function(params, callback){
        var user = {name: 'fetched user', id: params.id};
        callback(user);
        return user;
      };
      
      userSpy = spyOn(User, 'get').and.callFake(userGet);
      
      cacheGet = function(){
        return undefined;
      };
      
      cacheSpy = spyOn(UUIDCache, 'get').and.callFake(cacheGet);
      spyOn(UUIDCache, 'put'); //just stub this out
      UserCache = _UserCache_;
    }]));

    it('should query the user service if its not in the cache', inject(function() {
      var result = UserCache.get(5);
      expect(userSpy).toHaveBeenCalledWith({id: 5}, jasmine.any(Function));
      expect(result).toEqual({name: 'fetched user', id: 5});
    }));
  });
});
