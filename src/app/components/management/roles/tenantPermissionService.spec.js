'use strict';

describe('TenantPermission service', function(){
  var TenantPermission;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['TenantPermission', function(_TenantPermission) {
    TenantPermission = _TenantPermission;
  }]));
  
  describe('getDisplay prototype function', function(){
    it('should return the permission name', inject(function() {
      var myPermission = new TenantPermission({name: 'mypermissionname'});
      expect(myPermission.getDisplay()).toEqual('mypermissionname');
    }));
  });
});
