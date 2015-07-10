'use strict';

describe('setStatusBulkAction directive', function() {
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
    
    element = $compile('<ba-set-status bulk-action="bulkAction"></ba-set-status>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });
  
  it('should override bulkAction.execute', function() {
    expect(isolateScope.bulkAction.execute).toBeDefined();
  });
  
  it('should should set user.status on bulkAction.execute', inject(['mockUsers', function(mockUsers) {
    isolateScope.status = 'blah'
    var user = isolateScope.bulkAction.execute(mockUsers[0]);
    expect(user.status).toEqual(isolateScope.status);
  }]));
});