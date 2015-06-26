'use strict';

/*global spyOn, localStorage : false */

describe('UUIDCache service', function(){
  var UUIDCache;
  
  beforeEach(module('liveopsConfigPanel', function($provide){
    $provide.constant('uuidcacheKey', 'myKey');
  }));
  
  beforeEach(inject(['UUIDCache', function(_UUIDCache_) {
    UUIDCache = _UUIDCache_;
  }]));
  
  describe('store function', function(){
    it('should store the items in localstorage with the uuidcacheKey', inject(function() {
      spyOn(localStorage, 'setItem');
      UUIDCache.items = {'id1' : {title : 'wheee'}, 'id2' : {title: 'boooo'}};
      UUIDCache.store();
      expect(localStorage.setItem).toHaveBeenCalledWith('myKey', '{"id1":{"title":"wheee"},"id2":{"title":"boooo"}}');
    }));
  });
  
  describe('destroy function', function(){
    it('should remove the uuidcacheKey entry from localStorage', inject(function() {
      spyOn(localStorage, 'removeItem');
      UUIDCache.destroy();
      expect(localStorage.removeItem).toHaveBeenCalledWith('myKey');
    }));
  });
  
  describe('restore function', function(){
    it('should remove the uuidcacheKey entry from localStorage', inject(function() {
      spyOn(localStorage, 'getItem').and.callFake(function(){
        return '{"id1":{"title":"wheee"},"id2":{"title":"boooo"}}';
      });
      
      UUIDCache.restore();
      expect(localStorage.getItem).toHaveBeenCalledWith('myKey');
    }));
  });
  
  describe('put function', function(){
    it('should the item', inject(function() {
      UUIDCache.put('someid', {title: 'my cool object'});
      expect(UUIDCache.items.someid).toEqual({title: 'my cool object'});
    }));
    
    it('should call store', inject(function() {
      spyOn(UUIDCache, 'store');
      UUIDCache.put('someid', {title: 'my cool object'});
      expect(UUIDCache.store).toHaveBeenCalled();
    }));
  });
  
  describe('get function', function(){
    it('should return the item with the corresponding key', inject(function() {
      UUIDCache.items = {'id1' : {title : 'wheee'}, 'id2' : {title: 'boooo'}};
      expect(UUIDCache.get('id2')).toEqual({title: 'boooo'});
    }));
  });
  
  describe('remove function', function(){
    it('should remove the item', inject(function() {
      UUIDCache.items = {'id1' : {title : 'wheee'}, 'id2' : {title: 'boooo'}};
      UUIDCache.remove('id1');
      expect(UUIDCache.get('id1')).toBeUndefined();
      expect(UUIDCache.items['id2']).toBeDefined();
    }));
    
    it('should call store', inject(function() {
      spyOn(UUIDCache, 'store');
      UUIDCache.items = {'id1' : {title : 'wheee'}, 'id2' : {title: 'boooo'}};
      UUIDCache.remove('id1');
      expect(UUIDCache.store).toHaveBeenCalled();
    }));
  });
});
