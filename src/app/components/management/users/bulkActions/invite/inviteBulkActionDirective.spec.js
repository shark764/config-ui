'use strict';

describe('baInvite directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    mockTenantUsers;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'mockTenantUsers',
    function(_$compile_, _$rootScope_, _mockTenantUsers) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      mockTenantUsers = _mockTenantUsers;
    }
  ]));

  beforeEach(function() {
    element = $compile('<ba-invite></ba-invite>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });
  
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
