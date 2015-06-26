'use strict';

/*global spyOn, jasmine : false */

describe('UserName service', function(){
  var UserName,
      cacheSpy,
      userSpy,
      userGet,
      cacheGet;
  
  beforeEach(module('liveopsConfigPanel'));
  
  describe('cached calls', function(){
    beforeEach(inject(['UUIDCache', 'UserName', function(UUIDCache, _UserName_) {
      cacheGet = function(id){
        var user = {name: 'cached user', id: id};
        return user;
      };
      
      cacheSpy = spyOn(UUIDCache, 'get').and.callFake(cacheGet);
      UserName = _UserName_;
    }]));

    it('should return nothing if not given an id', inject(function() {
      expect(UserName.get()).toBeUndefined();
    }));
    
    it('should check the cache for the given id', inject(function() {
      UserName.get(5);
      expect(cacheSpy).toHaveBeenCalledWith(5);
    }));
    
    it('should return the cache value if it is defined', inject(function() {
      expect(UserName.get(5)).toEqual({name: 'cached user', id: 5});
    }));
    
    it('should call the callback if defined', inject(function() {
      var callbackSpy = jasmine.createSpy();
      UserName.get(5, callbackSpy);
      expect(callbackSpy).toHaveBeenCalledWith({name: 'cached user', id: 5});
    }));
  });
  
  describe('uncached calls', function(){
    beforeEach(inject(['User', 'UUIDCache', 'UserName', function(User, UUIDCache, _UserName_) {
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
      UserName = _UserName_;
    }]));

    it('should query the user service if its not in the cache', inject(function() {
      var result = UserName.get(5);
      expect(userSpy).toHaveBeenCalledWith({id: 5}, jasmine.any(Function));
      expect(result).toEqual({name: 'fetched user', id: 5});
    }));
    
    it('should call the callback if defined', inject(function() {
      var callbackSpy = jasmine.createSpy();
      UserName.get(5, callbackSpy);
      expect(callbackSpy).toHaveBeenCalledWith({name: 'fetched user', id: 5});
    }));
  });
});
