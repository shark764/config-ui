'use strict';

describe('tenant user status directive', function(){
  var $scope,
   $compile;
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_,_$rootScope_) {
    $scope = _$rootScope_.$new();
    $scope.userState = 'enabled';
    $compile = _$compile_;
 }]));

  it('should have ngMOdel', inject(function() {
    var element = $compile('<tenant-user-status ng-model="userState"></tenant-user-statuse>')($scope);
    $scope.$digest();
    expect(element.isolateScope().ngModel).toEqual('enabled');
  }));

});