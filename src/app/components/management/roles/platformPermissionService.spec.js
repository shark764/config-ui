'use strict';

describe('PlatformPermission service', function(){
  var PlatformPermission;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['PlatformPermission', function(_PlatformPermission) {
    PlatformPermission = _PlatformPermission;
  }]));
  
  describe('getDisplay prototype function', function(){
    it('should return the permission name', inject(function() {
      var myPermission = new PlatformPermission({name: 'mypermissionname'});
      expect(myPermission.getDisplay()).toEqual('mypermissionname');
    }));
  });
});
