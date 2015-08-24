'use strict';

describe('userState directive', function(){
  var $scope,
   $compile;
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_,_$rootScope_) {
    $scope = _$rootScope_.$new();
    $scope.userState = 'offline';
    $compile = _$compile_;
 }]));

  it('should have the ngModel defined in scope', inject(function() {
    var element = $compile('<user-state name="userState" ng-model="userState"></user-state>')($scope);
    $scope.$digest();
    var isolateScope = element.isolateScope();
    expect(isolateScope.ngModel).toEqual('offline');
  }));

});