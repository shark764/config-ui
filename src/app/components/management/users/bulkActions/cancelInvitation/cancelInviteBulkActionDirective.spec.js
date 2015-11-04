'use strict';

describe('setStatusBulkAction directive', function() {
  var $scope,
    $compile,
    element,
    isolateScope,
    BulkAction;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.user.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.user.mock'));

  beforeEach(inject(['$compile', '$rootScope', 'BulkAction',
    function(_$compile_, _$rootScope_, _BulkAction) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      BulkAction = _BulkAction;
    }
  ]));

  beforeEach(function() {
    // $scope.bulkAction = new BulkAction();
    // 
    // element = $compile('<ba-set-status bulk-action="bulkAction"></ba-set-status>')($scope);
    // $scope.$digest();
    // isolateScope = element.isolateScope();
  });
});
