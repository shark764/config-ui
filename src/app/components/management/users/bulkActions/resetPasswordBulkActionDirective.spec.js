'use strict';

describe('resetPasswordBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));
  
  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function (_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
  }]));

  beforeEach(function () {
    $scope.bulkAction = new BulkAction();
    
    element = $compile('<ba-reset-password bulk-action="bulkAction"></ba-reset-password>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });
  
  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.execute).toBeDefined();
  });
  
  it('should should set user.password on bulkAction.execute', inject(['mockUsers', function(mockUsers) {
    isolateScope.password = 'blah'
    var user = isolateScope.bulkAction.execute(mockUsers[0]);
    expect(user.password).toEqual(isolateScope.password);
  }]));
});