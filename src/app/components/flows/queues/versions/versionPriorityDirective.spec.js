'use strict';

describe('versionPriority directive', function() {
  var $scope,
    element,
    doDefaultCompile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();

    doDefaultCompile = function(){
      element = $compile('<version-priority></version-priority>')($scope);
      $scope.$digest();
    };
  }]));

  it('should set versionPriorityUnits', function() {
    doDefaultCompile();
    expect(element.isolateScope().versionPriorityUnits).toBeDefined();
  });
});
