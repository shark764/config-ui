'use strict';

describe('baInvite directive', function() {
  var $scope,
    element,
    isolateScope,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'mockTenantUsers',
    function($compile, $rootScope, _mockTenantUsers) {
      $scope = $rootScope.$new();
      mockTenantUsers = _mockTenantUsers;

      element = $compile('<ba-invite></ba-invite>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));
  
  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');
    
    var childElement = angular.element('<ba-invite></ba-invite>');
    element.append(childElement);
    var childScope = $rootScope.$new();
    childElement = $compile(childElement)(childScope);
    childScope.$digest();

    expect(baExecutorController.register).toHaveBeenCalled();
  }));

  describe('ON apply', function() {
    it('should call tenantUser.save', function() {
      mockTenantUsers[0].save = jasmine.createSpy('save');
      isolateScope.bulkAction.apply(mockTenantUsers[0]);
      expect(mockTenantUsers[0].status).toEqual('invited');
      expect(mockTenantUsers[0].save).toHaveBeenCalled();
    });
  });

  describe('ON doesQualify', function() {
    it('should pass if tenantUser.status is "pending"', function() {
      var doesQualify = isolateScope.bulkAction.doesQualify(mockTenantUsers[0]);
      expect(doesQualify).toBeTruthy();
    });

    it('should pass if tenantUser.status is not "pending"', function() {
      var doesQualify = isolateScope.bulkAction.doesQualify(mockTenantUsers[1]);
      expect(doesQualify).toBeFalsy();
    });
  });
});
