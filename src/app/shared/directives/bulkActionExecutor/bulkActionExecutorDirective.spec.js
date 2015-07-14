'use strict';

describe('bulkActionExecutor directive', function () {
  var $scope,
    $compile,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content.management.users'));

  beforeEach(inject(['$compile', '$rootScope', function (_$compile_, _$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));

  beforeEach(function () {
    element = $compile('<bulk-action-executor items="items" bulk-actions="bulkActions"></bulk-action-executor>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  });

  it('should do something', function () {
    
  });
});