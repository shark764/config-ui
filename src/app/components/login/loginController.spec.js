'use strict';

var $scope,
  $state,
  $httpBackend,
  apiHostname,
  controller,
  $q,
  AuthService;

var TOKEN_RESPONSE = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyLWlkIjoiYzA5NTFkNTAtNjU2Yy0xMWU2LWIxYjktY2E4MTQ4NDQ4OGRmIiwidHlwZSI6InRva2VuIiwiZXhwIjoxNDc4NzEwMzk0LCJpYXQiOjE0Nzg2MjM5OTR9.JhUVmcBiJ3GvroQ3HfX8hZYAiEjfXHO2EI1J-XhJt88',
  ttl: 86400
};


describe('LoginController', function() {
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$q', '$rootScope', '$controller', '$state', '$httpBackend', 'apiHostname', 'AuthService',
    function(_$q, $rootScope, $controller, _$state, _$httpBackend, _apiHostname, _AuthService) {
      $scope = $rootScope.$new();
      $q = _$q;
      $state = _$state;
      $httpBackend = _$httpBackend;
      apiHostname = _apiHostname;
      AuthService = _AuthService;

      controller = $controller('LoginController', {
        '$scope': $scope
      });

      // prevent login before we password is entered
      $scope.innerScope.passwordView = true;

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
        'result': [{
          'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
          'description': 'US East (N. Virginia)',
          'name': 'us-east-1'
        }]
      });
    }
  ]));

  describe('LoginController login success', function() {
    it('should redirect to root on success if user has permissions', inject(function(UserPermissions) {
      spyOn(UserPermissions, 'hasPermission').and.returnValue(true);
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'login')
      .and.returnValue(deferred.promise)
      .and.callFake(function() {
        $httpBackend.when('GET', apiHostname + '/v1/users/userId1').respond(200);
        spyOn($state, 'go');
        $scope.innerScope.login();
        $scope.$digest();
        expect($state.go).toHaveBeenCalledWith('content.management.users');
      });
    }));

    it('should redirect to user profile page on success if user doesn\'t have permissions', inject(function(UserPermissions) {
      spyOn(UserPermissions, 'hasPermission').and.returnValue(false);
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'login').and.returnValue(deferred.promise)
      .and.callFake(function() {
        $httpBackend.when('GET', apiHostname + '/v1/users/userId1').respond(200);
        spyOn($state, 'go');
        $scope.innerScope.login();
        $scope.$digest();
        expect($state.go).toHaveBeenCalledWith('content.userprofile');
      });
    }));

    it('should accept the invite if tenantid is specified in url',
      inject(function($stateParams, mockTenantUsers) {
        $stateParams.tenantId = 'tenant-id';
        var deferred = $q.defer();
        deferred.resolve({
          data: {
            result: {
              userId: 'userId1'
            }
          }
        });

        spyOn(AuthService, 'login').and.returnValue(deferred.promise)
        .and.callFake(function() {
	spyOn($state, 'go');
	spyOn(controller, 'inviteAcceptSuccess');

	$httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200, mockTenantUsers[0]);
	$scope.innerScope.login();
	$scope.$digest();
	$httpBackend.flush();
        });
      }
    ));
  });

  describe('LoginController login fail', function() {
    it('should not redirect me on 401 and show authentication error', function() {
      $httpBackend.whenPOST(apiHostname + '/v1/tokens').respond(TOKEN_RESPONSE);
      $httpBackend.expectPOST(apiHostname + '/v1/tokens');

      $httpBackend.expect('POST', apiHostname + '/v1/login').respond(401, {
        error: 'Invalid username and password.'
      });

      $scope.innerScope.username = 'username';
      $scope.innerScope.password = 'password';

      $scope.innerScope.login();
      $httpBackend.flush();
      expect($state.current.name).toBe('login');
    });

    it('should not redirect me 500 and do nothing', function() {
      $httpBackend.whenPOST(apiHostname + '/v1/tokens').respond(TOKEN_RESPONSE);
      $httpBackend.expectPOST(apiHostname + '/v1/tokens');

      $httpBackend.expect('POST', apiHostname + '/v1/login').respond(500);

      $scope.innerScope.username = 'username';
      $scope.innerScope.password = 'password';

      $scope.innerScope.login();
      $httpBackend.flush();

      expect($state.current.name).toBe('login');
    });
  });

  describe('inviteAcceptSuccess function', function() {
    it('should be called when invite accept succeeds', inject(function($stateParams, mockTenantUsers) {
      $stateParams.tenantId = 'tenant-id';
      var deferred = $q.defer();
      deferred.resolve({
        data: {
          result: {
            userId: 'userId1'
          }
        }
      });
      spyOn(AuthService, 'login').and.returnValue(deferred.promise)
      .and.callFake(function() {
      spyOn($state, 'go');
      spyOn(controller, 'inviteAcceptSuccess');

      $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200, mockTenantUsers[0]);
      $scope.innerScope.login();
      $scope.$digest();
      $httpBackend.flush();

      expect(controller.inviteAcceptSuccess).toHaveBeenCalled();
      });
    }));

    it('should refresh the tenants list', function() {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'refreshTenants').and.returnValue(deferred.promise);

      controller.inviteAcceptSuccess();
      expect(AuthService.refreshTenants).toHaveBeenCalled();
    });

    it('should select the tenant that corresponds to the invite', inject(function(Session, $stateParams) {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'refreshTenants').and.returnValue(deferred.promise);

      $stateParams.tenantId = 'tenant-id';
      Session.tenants = [{
        tenantId: '1'
      }, {
        tenantId: '2'
      }, {
        tenantId: 'tenant-id'
      }];

      controller.inviteAcceptSuccess();
      $scope.$digest();
      expect(Session.tenant.tenantId).toEqual('tenant-id');
    }));

    it('should forward to the root page if user has permissions', inject(function(UserPermissions, $state) {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(AuthService, 'refreshTenants').and.returnValue(deferred.promise);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(true);
      spyOn($state, 'go');

      controller.inviteAcceptSuccess();
      $scope.$digest();
      expect($state.go).toHaveBeenCalledWith('content.management.users', {
        messageKey: 'invite.accept.success'
      });
    }));

    it('should forward to the root page if user has permissions', inject(function(UserPermissions, $state) {
      var deferred = $q.defer();
      deferred.reject();
      spyOn(AuthService, 'refreshTenants').and.returnValue(deferred.promise);
      spyOn(UserPermissions, 'hasPermission').and.returnValue(false);
      spyOn($state, 'go');

      controller.inviteAcceptSuccess();
      $scope.$digest();
      expect($state.go).toHaveBeenCalledWith('content.userprofile', {
        messageKey: 'invite.accept.success'
      });
    }));
  });
});
