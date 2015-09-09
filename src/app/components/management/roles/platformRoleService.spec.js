'use strict';

describe('PlatformRole service', function(){
  var PlatformRole;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['PlatformRole', function(_PlatformRole) {
    PlatformRole = _PlatformRole;
  }]));
  
  describe('getDisplay prototype function', function(){
    it('should return the role name', inject(function() {
      var myRole = new PlatformRole({name: 'myrolename'});
      expect(myRole.getDisplay()).toEqual('myrolename');
    }));
  });
  
  describe('getName function', function(){
    it('should return the role name from cache for the given id', inject(function() {
      var myRole = new PlatformRole({name: 'myrolename', id: 'roleid'});
      spyOn(PlatformRole, 'cachedGet').and.returnValue(myRole);
      expect(PlatformRole.getName('roleid')).toEqual('myrolename');
    }));
  });
});
