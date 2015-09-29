'use strict';

describe('User service', function(){
  var User;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['User', function(_User_) {
    User = _User_;
  }]));
  
  describe('getDisplay prototype function', function(){
    it('should return the full name if the user item has a first name and/or a last name', inject(function() {
      var myuser = new User({firstName: 'douglas', lastName: 'adams'});
      expect(myuser.getDisplay()).toEqual('douglas adams');
      
      delete myuser.lastName;
      expect(myuser.getDisplay()).toEqual('douglas');
      
      delete myuser.firstName;
      myuser.lastName = 'smada';
      expect(myuser.getDisplay()).toEqual('smada');
    }));
    
    it('should return the email if there are no names on the object', inject(function() {
      var myuser = new User({email: 'theemail'});
      expect(myuser.getDisplay()).toEqual('theemail');
    }));
  });
});
