'use strict';

/* global spyOn: false  */

describe('invite accept controller', function() {
  var scope,
    $httpBackend,
    $controller,
    apiHostname,
    mockUsers,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));

  beforeEach(inject(['$rootScope', '$httpBackend', '$controller', 'apiHostname', 'mockUsers', 'mockTenantUsers',
    function($rootScope, _$httpBackend, _$controller, _apiHostname, _mockUsers, _mockTenantUsers) {
      scope = $rootScope.$new();
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
        '$scope': scope,
        'invitedUser': mockUser,
        'invitedTenantUser': mockTenantUser
      });
    }
  ]));

  describe('confirm password', function(){
    it('should exist', function(){
      expect(scope.checkPassword).toBeDefined();
    });
  });

  describe('save function', function() {
    beforeEach(function() {
      spyOn(scope, 'signupSuccess');
      spyOn(scope, 'signupFailure');
    });

    it('should exist', function() {
      expect(scope.save).toBeDefined();
      expect(scope.save).toEqual(jasmine.any(Function));
    });

    it('should save the user details', function() {
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond({
        'result': mockUsers[1]
      });

      scope.save();
      $httpBackend.flush();
    });

    it('should set newPassword', function() {
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond({
        'result': mockUsers[1]
      });

      scope.user.password = 'password';
      expect(scope.newPassword).toBeUndefined();
      scope.save();
      $httpBackend.flush();
      expect(scope.newPassword).toEqual('password');
    });

    it('should call signupSuccess on successful update', function() {
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond(200);

      scope.save();
      $httpBackend.flush();
      expect(scope.signupSuccess).toHaveBeenCalled();
    });

    it('should call signupFailure on unsuccessful update', function() {
      $httpBackend.expectPUT(apiHostname + '/v1/users/userId2').respond(500);

      scope.save();
      $httpBackend.flush();
      expect(scope.signupFailure).toHaveBeenCalled();
    });
  });

  describe('signupFailure function', function() {
    it('should exist', function() {
      expect(scope.signupFailure).toBeDefined();
      expect(scope.signupFailure).toEqual(jasmine.any(Function));
    });

    it('should show an alert', inject(['Alert', function(Alert) {
      spyOn(Alert, 'error');
      scope.signupFailure();
      expect(Alert.error).toHaveBeenCalled();
    }]));
  });

  describe('acceptFailure function', function() {
    it('should exist', function() {
      expect(scope.acceptFailure).toBeDefined();
      expect(scope.acceptFailure).toEqual(jasmine.any(Function));
    });

    it('should show an alert', inject(['Alert', function(Alert) {
      spyOn(Alert, 'error');
      scope.acceptFailure();
      expect(Alert.error).toHaveBeenCalled();
    }]));
  });

  describe('signupSuccess function', function() {
    beforeEach(inject([function() {
      spyOn(scope, 'acceptSuccess');
      spyOn(scope, 'acceptFailure');
    }]));

    it('should exist', function() {
      expect(scope.signupSuccess).toBeDefined();
      expect(scope.signupSuccess).toEqual(jasmine.any(Function));
    });

    it('should update the tenant user', inject(['TenantUser', function(TenantUser) {
      spyOn(TenantUser, 'update');
      scope.signupSuccess(mockUsers[0]);
      expect(TenantUser.update).toHaveBeenCalled();
    }]));
  });

  describe('acceptSuccess function', function() {
    beforeEach(inject(['$state', function($state) {
      spyOn($state, 'transitionTo');
    }]));

    it('should redirect to users management on login success if user has permissions', inject(function(AuthService, $stateParams, $q, $state, UserPermissions) {
      var deferred = $q.defer();
      deferred.resolve('success');

      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(true);

      $stateParams.userid = 'userId2';
      scope.acceptSuccess();
      scope.$digest();
      expect($state.transitionTo).toHaveBeenCalledWith('content.management.users', {
        id: 'userId2',
        messageKey: 'invite.accept.autologin.success'
      });
    }));

    it('should redirect to user profile page on login success if user has permissions', inject(function(AuthService, $stateParams, $q, $state, UserPermissions) {
      var deferred = $q.defer();
      deferred.resolve('success');

      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      spyOn(UserPermissions, 'hasPermissionInList').and.returnValue(false);

      $stateParams.userId = 'userId2';
      scope.acceptSuccess();
      scope.$digest();
      expect($state.transitionTo).toHaveBeenCalledWith('content.userprofile', {
        messageKey: 'invite.accept.autologin.success'
      });
    }));

    it('should show an alert on login fail', inject(function(AuthService, $state, $q) {
      var deferred = $q.defer();
      deferred.reject('failure');

      spyOn(AuthService, 'login').and.returnValue(deferred.promise);

      scope.acceptSuccess();
      scope.$digest();
      expect($state.transitionTo).toHaveBeenCalledWith('login', {
        messageKey: 'invite.accept.autologin.fail'
      });
    }));
  });
});
