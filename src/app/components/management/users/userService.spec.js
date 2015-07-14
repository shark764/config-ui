'use strict';

/*global spyOn, localStorage : false */

describe('User service', function(){
  var User;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['User', function(_User_) {
    User = _User_;
  }]));
  
  describe('fullName prototype function', function(){
    it('should return the full name if the user item has a first name and/or a last name', inject(function() {
      var myuser = new User({firstName: 'douglas', lastName: 'adams'});
      expect(myuser.fullName()).toEqual('douglas adams');
      
      delete myuser.lastName;
      expect(myuser.fullName()).toEqual('douglas');
      
      delete myuser.firstName;
      myuser.lastName = 'smada';
      expect(myuser.fullName()).toEqual('smada');
    }));
    
    it('should return the display name only if no name parts are is present', inject(function() {
      var myuser = new User({firstName: 'douglas', lastName: 'adams', displayName: 'display'});
      expect(myuser.fullName()).toEqual('douglas adams');
      
      delete myuser.firstName;
      delete myuser.lastName;
      expect(myuser.fullName()).toEqual('display');
    }));
    
    it('should return empty string if there are no names on the pbject', inject(function() {
      var myuser = new User({something: 'else'});
      expect(myuser.fullName()).toEqual('');
    }));
  });
});
