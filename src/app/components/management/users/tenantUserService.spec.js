'use strict';

describe('TenantUser service', function(){
  var TenantUser;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['TenantUser', function(_TenantUser_) {
    TenantUser = _TenantUser_;
  }]));
  
  describe('getDisplay prototype function', function(){
    it('should return the full name if the TenantUser item has a first name and/or a last name', inject(function() {
      var myuser = new TenantUser({firstName: 'douglas', lastName: 'adams'});
      expect(myuser.getDisplay()).toEqual('douglas adams');
      
      delete myuser.lastName;
      expect(myuser.getDisplay()).toEqual('douglas');
      
      delete myuser.firstName;
      myuser.lastName = 'smada';
      expect(myuser.getDisplay()).toEqual('smada');
    }));
    
    it('should return empty string if there are no names on the pbject', inject(function() {
      var myuser = new TenantUser({something: 'else'});
      expect(myuser.getDisplay()).toEqual('');
    }));
  });
});