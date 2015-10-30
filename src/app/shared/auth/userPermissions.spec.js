'use strict';

/* global spyOn: false  */

describe('UserPermissions Service', function () {
  var UserPermissions,
    Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock'));
  
  beforeEach(inject(['UserPermissions', 'Session', function (_UserPermissions, _Session) {
      UserPermissions = _UserPermissions;
      Session = _Session;
  }]));

  describe('hasPermission function', function(){
    it ('should exist', function(){
      expect(UserPermissions.hasPermission).toBeDefined();
      expect(UserPermissions.hasPermission).toEqual(jasmine.any(Function));
    });
    
    it ('should return true if the given permission is in the Sessions platform permissions list', function(){
      Session.platformPermissions = ['permission1', 'permission2', 'permission3'];
      Session.tenant.tenantPermissions = [];
      
      var result = UserPermissions.hasPermission('permission2');
      expect(result).toBeTruthy();
    });
    
    it ('should return true if the given permission is in the selected tenants tenant permissions list', function(){
      Session.platformPermissions = [];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermission('permission2');
      expect(result).toBeTruthy();
    });
    
    it ('should return false if the given permission is not in either list', function(){
      Session.platformPermissions = ['permission5', 'permission6'];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermission('SOME_OTHER_PERMISSION');
      expect(result).toBeFalsy();
    });
  });
  
  describe('hasPermissionInList function', function(){
    it ('should exist', function(){
      expect(UserPermissions.hasPermissionInList).toBeDefined();
      expect(UserPermissions.hasPermissionInList).toEqual(jasmine.any(Function));
    });
    
    it ('should return true if one of the given permission is in the Sessions platform permissions list', function(){
      Session.platformPermissions = ['permission1', 'permission2', 'permission3'];
      Session.tenant.tenantPermissions = [];
      
      var result = UserPermissions.hasPermissionInList(['anotherPermission', 'permission2', 'somethinglese']);
      expect(result).toBeTruthy();
    });
    
    it ('should return true if the given permission is in the selected tenants tenant permissions list', function(){
      Session.platformPermissions = [];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermissionInList(['anotherPermission', 'permission2', 'permission3']);
      expect(result).toBeTruthy();
    });
    
    it ('should return false if none of the given permission is not in either list', function(){
      Session.platformPermissions = ['permission5', 'permission6'];
      Session.tenant.tenantPermissions = ['permission1', 'permission2', 'permission3'];
      
      var result = UserPermissions.hasPermissionInList(['SOME_OTHER_PERMISSION', 'NOT_A_PERMISSION']);
      expect(result).toBeFalsy();
    });
  });
  
  describe('resolvePermissions function', function(){
    it ('should exist', function(){
      expect(UserPermissions.resolvePermissions).toBeDefined();
      expect(UserPermissions.resolvePermissions).toEqual(jasmine.any(Function));
    });
    
    it ('should resolve the returned promise if the user has at least one of the permissions given', inject(['$timeout', function($timeout){
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
      var promise = UserPermissions.resolvePermissions(['A_PERMISSION']);
      $timeout.flush();
      
      expect(promise.$$state.status).toEqual(1);
    }]));
    
    it ('should reject the returned promise if the user does not have at least one of the permissions given', inject(['$timeout', function($timeout){
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);
      var promise = UserPermissions.resolvePermissions(['A_PERMISSION']);
      $timeout.flush();
      
      expect(promise.$$state.status).toEqual(2);
    }]));
  });
});
