'use strict';

/* global spyOn: false  */

describe('invite accept controller', function () {
  var $scope,
    $rootScope,
    $httpBackend,
    $controller,
    apiHostname,
    mockUsers,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'mockTenantUsers',
    function ($compile, _$rootScope, _$httpBackend, _$controller, _apiHostname, _mockUsers, _mockTenantUsers) {
      $rootScope = _$rootScope;
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      $controller = _$controller;
      mockUsers = _mockUsers;
      mockTenantUsers = _mockTenantUsers;
      apiHostname = _apiHostname;

      var mockUser = mockUsers[1];
      mockUser.status = 'pending';
      
      var mockTenantUser = mockTenantUsers[1];
      mockTenantUser.status = 'invited';
      
      $controller('InviteAcceptController', {
        '$scope': $scope,
        'invitedUser': mockUser,
        'invitedTenantUser': mockTenantUser
      });
    }
  ]));

  describe('init', function(){
    //TODO: re-enable when TITAN2-3042 is addressed
    xit('should redirect to login with a message if the invite was already accepted', inject(['$state', function($state){
      spyOn($state, 'transitionTo');
      
      var mockUser = mockUsers[1];
      mockUser.status = 'pending';
      
      var mockTenantUser = mockTenantUsers[1];
      mockTenantUser.status = 'accepted';
      
      $controller('InviteAcceptController', {
        '$scope': $rootScope.$new(),
        'invitedUser': mockUser,
        'invitedTenantUser': mockTenantUser
      });
      
      expect($state.transitionTo).toHaveBeenCalledWith('login', {messageKey: 'invite.accept.alreadyAccepted'});
    }]));
    
    it('should accept the invite and redirect to login if the user already exists', inject(['$state', '$stateParams', function($state, $stateParams){
      spyOn($state, 'transitionTo');
      
      var mockUser = mockUsers[1];
      mockUser.status = 'enabled';
      
      $stateParams.tenantId = 'tenant-id';
      $stateParams.userId = 'userId2';
      
      $httpBackend.expectPUT( apiHostname + '/v1/tenants/tenant-id/users/userId2').respond({
        'result': mockTenantUsers[1]
      });
      
      $controller('InviteAcceptController', {
        '$scope': $rootScope.$new(),
        'invitedUser': mockUser,
        'invitedTenantUser': mockTenantUsers[1]
      });
      
      $httpBackend.flush();
      expect($state.transitionTo).toHaveBeenCalledWith('login', {messageKey: 'invite.accept.success'});
    }]));
    
    it('should show an error if accepting an invite for an existing user fails', inject(['$stateParams', function($stateParams){
      var mockUser = mockUsers[1];
      mockUser.status = 'enabled';
      
      var mockTenantUser = mockTenantUsers[1];
      mockTenantUser.status = 'invited';
      
      $stateParams.tenantId = 'tenant-id';
      $stateParams.userId = 'userId2';
      
      $httpBackend.expectPUT( apiHostname + '/v1/tenants/tenant-id/users/userId2').respond(500);
      $scope = $rootScope.$new();
      
      $controller('InviteAcceptController', {
        '$scope': $scope,
        'invitedUser': mockUser,
        'invitedTenantUser': mockTenantUser
      });
      
      $httpBackend.flush();
      expect($scope.error).toBeDefined();
    }]));
    
    it('should set the error if the account is disabled', inject(['$state', '$stateParams', function($state, $stateParams){
      var mockUser = mockUsers[1];
      mockUser.status = 'disabled';
      $scope = $rootScope.$new();
      
      $controller('InviteAcceptController', {
        '$scope': $scope,
        'invitedUser': mockUser,
        'invitedTenantUser': mockTenantUsers[1]
      });

      expect($scope.error).toEqual('Sorry, your account is disabled. Please contact your account administrator.');
    }]));
  });
  
  describe('save function', function(){
    beforeEach(function(){
      spyOn($scope, 'signupSuccess');
      spyOn($scope, 'signupFailure');
    });
    
    it('should exist', function(){
      expect($scope.save).toBeDefined();
      expect($scope.save).toEqual(jasmine.any(Function));
    });
    
    it('should save the user details', function(){
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond({
        'result': mockUsers[1]
      });
      
      $scope.save();
      $httpBackend.flush();
    });
    
    it('should set newPassword', function(){
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond({
        'result': mockUsers[1]
      });
      
      $scope.user.password = 'password';
      expect($scope.newPassword).toBeUndefined();
      $scope.save();
      $httpBackend.flush();
      expect($scope.newPassword).toEqual('password');
    });
    
    it('should call signupSuccess on successful update', function(){
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond(200);
      
      $scope.save();
      $httpBackend.flush();
      expect($scope.signupSuccess).toHaveBeenCalled();
    });
    
    it('should call signupFailure on unsuccessful update', function(){
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond(500);
      
      $scope.save();
      $httpBackend.flush();
      expect($scope.signupFailure).toHaveBeenCalled();
    });
  });
  
  describe('signupFailure function', function(){
    it('should exist', function(){
      expect($scope.signupFailure).toBeDefined();
      expect($scope.signupFailure).toEqual(jasmine.any(Function));
    });
    
    it('should show an alert', inject(['Alert', function(Alert){
      spyOn(Alert, 'error');
      $scope.signupFailure();
      expect(Alert.error).toHaveBeenCalled();
    }]));
  });
  
  describe('acceptFailure function', function(){
    it('should exist', function(){
      expect($scope.acceptFailure).toBeDefined();
      expect($scope.acceptFailure).toEqual(jasmine.any(Function));
    });
    
    it('should show an alert', inject(['Alert', function(Alert){
      spyOn(Alert, 'error');
      $scope.acceptFailure();
      expect(Alert.error).toHaveBeenCalled();
    }]));
  });
  
  describe('signupSuccess function', function(){
    beforeEach(inject([function(){
      spyOn($scope, 'acceptSuccess');
      spyOn($scope, 'acceptFailure');
    }]));
    
    it('should exist', function(){
      expect($scope.signupSuccess).toBeDefined();
      expect($scope.signupSuccess).toEqual(jasmine.any(Function));
    });
    
    it('should update the tenant user', inject(['TenantUser', function(TenantUser){
      spyOn(TenantUser, 'update');
      $scope.signupSuccess(mockUsers[0]);
      expect(TenantUser.update).toHaveBeenCalled();
    }]));
  });
  
  describe('acceptSuccess function', function(){
    beforeEach(inject(['$state', function($state){
      spyOn($state, 'transitionTo');
    }]));
    
    it('should redirect to users management on login success if user has permissions', inject(['AuthService', '$stateParams', '$q', '$state', 'UserPermissions', function(AuthService, $stateParams, $q, $state, UserPermissions){
      var deferred = $q.defer();
      deferred.resolve('success');
      
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);
      
      $stateParams.userId = 'userId2';
      $scope.acceptSuccess();
      $scope.$digest();
      expect($state.transitionTo).toHaveBeenCalledWith('content.management.users', {id: 'userId2', messageKey: 'invite.accept.autologin.success'});
    }]));
    
    it('should redirect to user profile page on login success if user has permissions', inject(['AuthService', '$stateParams', '$q', '$state', 'UserPermissions', function(AuthService, $stateParams, $q, $state, UserPermissions){
      var deferred = $q.defer();
      deferred.resolve('success');
      
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);
      
      $stateParams.userId = 'userId2';
      $scope.acceptSuccess();
      $scope.$digest();
      expect($state.transitionTo).toHaveBeenCalledWith('content.userprofile', {messageKey: 'invite.accept.autologin.success'});
    }]));
    
    it('should show an alert on login fail', inject(['AuthService', '$state', '$q', function(AuthService, $state, $q){
      var deferred = $q.defer();
      deferred.reject('failure');
      
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      
      $scope.acceptSuccess();
      $scope.$digest();
      expect($state.transitionTo).toHaveBeenCalledWith('login', {messageKey: 'invite.accept.autologin.fail'});
    }]));
  });
});
