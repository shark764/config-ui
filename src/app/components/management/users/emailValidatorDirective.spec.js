'use strict';

describe('duplicateEmail directive', function() {
  var $scope,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.tenantUsers'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$compile', '$rootScope', 'mockUsers', 'mockTenantUsers',
    function($compile, $rootScope, mockUsers, mockTenantUsers) {
      $scope = $rootScope.$new();
      
      $scope.fetchTenantUsers = jasmine.createSpy('$scope.fetchTenantUsers').and.returnValue(
        [mockTenantUsers[0], mockTenantUsers[1]]);
      
      $scope.resource = mockUsers[0];
      
      var element = angular.element('<div ng-model="resource.email" ng-resource="resource" duplicate-email></div>');
      $compile(element)($scope);
      
      $scope.$digest();
      isolateScope = element.scope();
    }
  ]));

  it('should do something', function() {
    
  });
});
