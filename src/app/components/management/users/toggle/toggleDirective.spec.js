'use strict';

describe('toggleDirective', function(){
  var $scope,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    $scope.obj = {
      prop: 'test1'
    };
    
    $scope.bool = false;
    
    element = $compile('<toggle ng-model="obj" ng-disabled="bool"></toggle>')($scope);
    $scope.$digest();
  }]));
  
  it('should do something', function() {
    var isolateScope = element.isolateScope();
    expect(isolateScope.ngModel).toBe($scope.obj);
    expect(isolateScope.ngDisabled).toBe($scope.bool);
  });
});