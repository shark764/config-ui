'use strict';

describe('baCancelInvite directive', function() {
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
    element = $compile('<ba-cancel-invite></ba-cancel-invite>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });
  
  describe('ON apply', function() {
    
    it('should call tenantUser.save', function() {
      mockTenantUsers[3].save = jasmine.createSpy('save');
      isolateScope.bulkAction.apply(mockTenantUsers[3]);
      expect(mockTenantUsers[3].status).toEqual('pending');
      expect(mockTenantUsers[3].save).toHaveBeenCalled();
    });
  });
  
  describe('ON doesQualify', function() {
    it('should pass', function() {
      var doesQualify = isolateScope.bulkAction.doesQualify(mockTenantUsers[3]);
      expect(doesQualify).toBeTruthy();
    });
    
    it('should not pass', function() {
      var doesQualify = isolateScope.bulkAction.doesQualify(mockTenantUsers[0]);
      expect(doesQualify).toBeFalsy();
    });
  });
});
