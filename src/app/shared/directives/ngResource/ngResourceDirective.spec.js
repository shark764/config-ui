'use strict';

describe('ngResource directive', function(){
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    $scope.ngResource = {};

    element = $compile('<div ng-resource="ngResource"></div>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should do something someday', function() {});
});
