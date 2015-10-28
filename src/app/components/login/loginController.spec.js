'use strict';

var $scope,
  $state,
  $httpBackend,
  apiHostname,
  controller;

describe('LoginController', function () {
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$q', '$rootScope', '$controller', '$state', '$httpBackend', 'apiHostname',
    function ($q, _$rootScope_, _$controller_, _$state, _$httpBackend_, _apiHostname_) {
      $scope = _$rootScope_;
      $state = _$state;
      $httpBackend = _$httpBackend_;
      apiHostname = _apiHostname_;

      controller = _$controller_('LoginController', {
        '$scope': $scope
      });

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({
        'result': [{
          'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
          'description': 'US East (N. Virginia)',
          'name': 'us-east-1'
        }]
      });
    }
  ]));

  describe('LoginController login success', function () {
    it('should redirect to root on success if user has permissions', inject(['$q', 'AuthService', 'UserPermissions', function ($q, AuthService, UserPermissions) {
      spyOn(UserPermissions, 'hasPermission').and.returnValue(true);
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      spyOn($state, 'go');

      $scope.login();
      $scope.$digest();

      expect($state.go).toHaveBeenCalledWith('content.management.users');
    }]));

    it('should redirect to user profile page on success if user doesn\'t have permissions', inject(['$q', 'AuthService', 'UserPermissions', function ($q, AuthService, UserPermissions) {
      spyOn(UserPermissions, 'hasPermission').and.returnValue(false);
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'login').and.returnValue(deferred.promise);
      spyOn($state, 'go');

      $scope.login();
      $scope.$digest();

      expect($state.go).toHaveBeenCalledWith('content.userprofile');
    }]));

    it('should accept the invite if tenantid is specified in url',
      inject(['$q', 'AuthService', '$stateParams', 'apiHostname', '$httpBackend', 'mockTenantUsers',
        function ($q, AuthService, $stateParams, apiHostname, $httpBackend, mockTenantUsers) {
          $stateParams.tenantId = 'tenant-id';
          var deferred = $q.defer();
          deferred.resolve({
            data: {
              result: {
                userId: 'userId1'
              }
            }
          });
          spyOn(AuthService, 'login').and.returnValue(deferred.promise);
          spyOn($state, 'go');
          spyOn(controller, 'inviteAcceptSuccess');

          $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200, mockTenantUsers[0]);
          $scope.login();
          $scope.$digest();
          $httpBackend.flush();
        }
      ]));
  });

  describe('LoginController login fail', function () {

    it('should not redirect me on 401 and show authentication error', function () {

      $httpBackend.expect('POST', apiHostname + '/v1/login').respond(401, {
        error: 'Invalid username and password.'
      });

      $scope.username = 'username';
      $scope.password = 'password';

      $scope.login();
      $httpBackend.flush();

      expect($state.current.name).toBe('login');
    });

    it('should not redirect me 500 and do nothing', function () {

      $httpBackend.expect('POST', apiHostname + '/v1/login').respond(500);

      $scope.username = 'username';
      $scope.password = 'password';

      $scope.login();
      $httpBackend.flush();

      expect($state.current.name).toBe('login');
    });
  });

  describe('inviteAcceptSuccess function', function () {
    it('should be called when invite accept succeeds',
      inject(['$q', 'AuthService', '$stateParams', 'apiHostname', '$httpBackend', 'mockTenantUsers',
        function ($q, AuthService, $stateParams, apiHostname, $httpBackend, mockTenantUsers) {
          $stateParams.tenantId = 'tenant-id';
          var deferred = $q.defer();
          deferred.resolve({
            data: {
              result: {
                userId: 'userId1'
              }
            }
          });
          spyOn(AuthService, 'login').and.returnValue(deferred.promise);
          spyOn($state, 'go');
          spyOn(controller, 'inviteAcceptSuccess');

          $httpBackend.expectPUT(apiHostname + '/v1/tenants/tenant-id/users/userId1').respond(200, mockTenantUsers[0]);
          $scope.login();
          $scope.$digest();
          $httpBackend.flush();

          expect(controller.inviteAcceptSuccess).toHaveBeenCalled();
        }
      ]));

    it('should refresh the tenants list', inject(['$q', 'AuthService', function ($q, AuthService) {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(AuthService, 'refreshTenants').and.returnValue(deferred.promise);

      controller.inviteAcceptSuccess();
      expect(AuthService.refreshTenants).toHaveBeenCalled();
    }]));

    it('should select the tenant that corresponds to the invite', inject(['$q', 'AuthService', 'Session', '$stateParams', function ($q, AuthService, Session, $stateParams) {
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
    }]));

    it('should forward to the root page if user has permissions', inject(['$q', 'AuthService', 'UserPermissions', '$state', function ($q, AuthService, UserPermissions, $state) {
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
    }]));

    it('should forward to the root page if user has permissions', inject(['$q', 'AuthService', 'UserPermissions', '$state', function ($q, AuthService, UserPermissions, $state) {
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
    }]));
  });
});