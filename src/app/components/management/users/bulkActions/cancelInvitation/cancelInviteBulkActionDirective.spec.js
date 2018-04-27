'use strict';

describe('baCancelInvite directive', function() {
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

      element = $compile('<ba-cancel-invite></ba-cancel-invite>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should register the bulkAction with bulkActionExecutor if present', inject(function($compile, $rootScope) {
    element = $compile('<bulk-action-executor></bulk-action-executor>')($scope);
    $scope.$digest();
    var baExecutorController = element.controller('bulkActionExecutor');
    spyOn(baExecutorController, 'register');

    var childElement = angular.element('<ba-cancel-invite></ba-cancel-invite>');
    element.append(childElement);
    var childScope = $rootScope.$new();
    childElement = $compile(childElement)(childScope);
    childScope.$digest();

    expect(baExecutorController.register).toHaveBeenCalled();
  }));

  describe('ON apply', function() {
    it('should call tenantUser.save', function() {
      mockTenantUsers[2].invitationStatus = 'invited';
      mockTenantUsers[2].save = jasmine.createSpy('save');

      isolateScope.bulkAction.apply(mockTenantUsers[2]);
      expect(mockTenantUsers[2].status).toEqual('pending');
      expect(mockTenantUsers[2].save).toHaveBeenCalled();
    });
  });

  describe('ON doesQualify', function() {
    it('should pass if tenantUser.invitationStatus is "invited"', function() {
      mockTenantUsers[3].invitationStatus = 'invited';
      var doesQualify = isolateScope.bulkAction.doesQualify(mockTenantUsers[3]);
      expect(doesQualify).toBeTruthy();
    });

    it('should NOT pass if tenantUser.invitationStatus is NOT "invited"', function() {
      mockTenantUsers[1].invitationStatus ='pending';
      var doesQualify = isolateScope.bulkAction.doesQualify(mockTenantUsers[1]);
      expect(doesQualify).toBeFalsy();
    });
  });
});
