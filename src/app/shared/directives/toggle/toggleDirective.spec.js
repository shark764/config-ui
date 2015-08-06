'use strict';

describe('toggleDirective', function(){
  var $scope,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    $scope.model = false;
    
    $scope.bool = false;
    
    element = $compile('<toggle ng-model="model" ng-disabled="bool"></toggle>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));
  
  it('should do something', function() {
    expect(isolateScope.ngModel).toBe($scope.model);
    expect(isolateScope.ngDisabled).toBe($scope.bool);
  });
  
  it('should set a default falseValue and trueValue if none are given', function() {
    expect(isolateScope.falseValue).toEqual(false);
    expect(isolateScope.trueValue).toEqual(true);
  });
  
  it('should set a default falseValue and trueValue if none are given', function() {
    expect(isolateScope.falseValue).toEqual(false);
    expect(isolateScope.trueValue).toEqual(true);
  });
});