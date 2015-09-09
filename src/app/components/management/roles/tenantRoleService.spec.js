'use strict';

describe('TenantRole service', function(){
  var TenantRole;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['TenantRole', function(_TenantRole) {
    TenantRole = _TenantRole;
  }]));
  
  describe('getDisplay prototype function', function(){
    it('should return the role name', inject(function() {
      var myRole = new TenantRole({name: 'myrolename'});
      expect(myRole.getDisplay()).toEqual('myrolename');
    }));
  });
  
  describe('getName function', function(){
    it('should return the role name from cache for the given id', inject(function() {
      var myRole = new TenantRole({name: 'myrolename', id: 'roleid'});
      spyOn(TenantRole, 'cachedGet').and.returnValue(myRole);
      expect(TenantRole.getName('roleid')).toEqual('myrolename');
    }));
  });
});
