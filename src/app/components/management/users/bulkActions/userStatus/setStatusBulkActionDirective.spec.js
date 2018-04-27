'use strict';

describe('setStatusBulkAction directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));

  beforeEach(inject(['$compile', '$rootScope',
    function($compile, $rootScope) {
      $scope = $rootScope.$new();

      element = $compile('<ba-set-status></ba-set-status>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');

    var childElement = angular.element('<ba-set-status></ba-set-status>');
    element.append(childElement);
    var childScope = $rootScope.$new();
    childElement = $compile(childElement)(childScope);
    childScope.$digest();

    expect(baExecutorController.register).toHaveBeenCalled();
  }));

  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.apply).toBeDefined();
  });

  it('should should set user.status on bulkAction.execute', inject(function(mockUsers, mockTenantUsers, $httpBackend, apiHostname) {
    mockTenantUsers[1].status = 'disabled';
    var returnUser = angular.copy(mockTenantUsers[1]);
    returnUser.status = 'accepted';

    $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId2').respond(200, {
      result: returnUser
    });

    mockTenantUsers[1].$user = mockUsers[1];
    mockTenantUsers[1].$original = mockTenantUsers[1];

    isolateScope.status = 'accepted';
    isolateScope.bulkAction.apply(mockTenantUsers[1]);

    expect(mockTenantUsers[1].status).toEqual('disabled');

    $httpBackend.flush();

    expect(mockTenantUsers[1].status).toEqual('accepted');
  }));

  it('should should only have the attribute in the PUT payload', inject(function(mockTenantUsers, $httpBackend, apiHostname) {
    $httpBackend.expect('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId2', {
      status: 'accepted'
    }).respond(200, mockTenantUsers[1]);

    isolateScope.status = 'accepted';
    mockTenantUsers[1].$original = mockTenantUsers[1];
    isolateScope.bulkAction.apply(mockTenantUsers[1]);

    $httpBackend.flush();
  }));

  it('should reject the change if user attempts to disable themselves', inject(function(mockTenantUsers) {
    mockTenantUsers[0].status = 'accepted';
    isolateScope.status = 'disabled';

    var result = isolateScope.bulkAction.apply(mockTenantUsers[0]);

    result.then(function() {
      throw new Error('Promise should not be resolved');
    }, function(reason) {
      expect(reason.msg).toEqual('Cannot disable your own account');
    });

    expect(mockTenantUsers[0].status).toEqual('accepted');
  }));

  describe('doesQualify function', function() {
    it('should pass if tenantUser.status is "accepted"', inject(function(TenantUser) {
      var user = new TenantUser({
        status: 'accepted'
      });

      var doesQualify = isolateScope.bulkAction.doesQualify(user);
      expect(doesQualify).toBeTruthy();
    }));

    it('should pass if tenantUser.status is "disabled"', inject(function(TenantUser) {
      var user = new TenantUser({
        status: 'disabled'
      });

      var doesQualify = isolateScope.bulkAction.doesQualify(user);
      expect(doesQualify).toBeTruthy();
    }));
  });
});
