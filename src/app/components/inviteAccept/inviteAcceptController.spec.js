'use strict';

/* global spyOn: false  */

describe('invite accept controller', function () {
  var $scope,
    $httpBackend,
    Session,
    controller,
    apiHostname,
    mockUsers,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));

  beforeEach(inject(['$compile', '$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'Session', 'mockTenantUsers',
    function ($compile, $rootScope, _$httpBackend, $controller, _apiHostname, _mockUsers, _Session_, _mockTenantUsers) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      mockUsers = _mockUsers;
      mockTenantUsers = _mockTenantUsers;
      apiHostname = _apiHostname;
      Session = _Session_;

      controller = $controller('InviteAcceptController', {
        '$scope': $scope,
        'invitedUser': mockUsers[1]
      });
    }
  ]));

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
  
  describe('signupSuccess function', function(){
    beforeEach(function(){
      spyOn($scope, 'loginSuccess');
      spyOn($scope, 'loginFailure');
    });
    
    it('should exist', function(){
      expect($scope.signupSuccess).toBeDefined();
      expect($scope.signupSuccess).toEqual(jasmine.any(Function));
    });
    
    it('should log the user in with their email and new password', inject(['AuthService', function(AuthService){
      spyOn(AuthService, 'login').and.callThrough();
      $scope.newPassword = 'newPassword';
      $scope.signupSuccess();
      expect(AuthService.login).toHaveBeenCalledWith(mockUsers[1].email, 'newPassword');
    }]));
    
    it('should call loginSuccess if authentication succeeds', inject(['AuthService', '$q', function(AuthService, $q){
      var deferred = $q.defer();
      deferred.resolve('success');
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      
      $scope.signupSuccess();
      $scope.$digest();
      expect($scope.loginSuccess).toHaveBeenCalled();
    }]));
    
    it('should call loginFailure if authentication fails', inject(['AuthService', '$q', function(AuthService, $q){
      var deferred = $q.defer();
      deferred.reject('failure');
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      
      $scope.signupSuccess();
      $scope.$digest();
      expect($scope.loginFailure).toHaveBeenCalled();
    }]));
  });
  
  describe('signupFailure function', function(){
    beforeEach(function(){
      spyOn($scope, 'loginSuccess');
      spyOn($scope, 'loginFailure');
    });
    
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
  
  describe('loginFailure function', function(){
    it('should exist', function(){
      expect($scope.loginFailure).toBeDefined();
      expect($scope.loginFailure).toEqual(jasmine.any(Function));
    });
    
    it('should show an alert', inject(['Alert', function(Alert){
      spyOn(Alert, 'error');
      $scope.loginFailure();
      expect(Alert.error).toHaveBeenCalled();
    }]));
  });
  
  describe('loginSuccess function', function(){
    beforeEach(inject(['$state', function($state){
      spyOn($state, 'transitionTo');
    }]));
    
    it('should exist', function(){
      expect($scope.loginSuccess).toBeDefined();
      expect($scope.loginSuccess).toEqual(jasmine.any(Function));
    });
    
    it('should update the tenant user', inject(['TenantUser', function(TenantUser){
      spyOn(TenantUser, 'update');
      $scope.loginSuccess();
      expect(TenantUser.update).toHaveBeenCalled();
    }]));
    
    it('should redirect to users management on update success', inject(['TenantUser', '$state', '$stateParams', function(TenantUser, $state, $stateParams){
      spyOn(TenantUser, 'update').and.callFake(function(params, success){
        success();
      });
      
      $stateParams.userId = 'userId2';
      $scope.loginSuccess();
      expect($state.transitionTo).toHaveBeenCalledWith('content.management.users', {id: 'userId2'});
    }]));
    
    it('should show an alert on update fail', inject(['TenantUser', 'Alert', function(TenantUser, Alert){
      spyOn(TenantUser, 'update').and.callFake(function(params, success, failure){
        failure();
      });
      spyOn(Alert, 'error');
      
      $scope.loginSuccess();
      expect(Alert.error).toHaveBeenCalled();
    }]));
  });
});
