'use strict';

/* global spyOn: false  */
describe('newUser directive', function () {
  var $rootScope,
    $scope,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function ($compile, _$rootScope_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    element = $compile('<div new-user></div>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should update displayName when firstName is changed', inject(function () {
    isolateScope.user.firstName = 'Karen';
    isolateScope.$digest();
    expect(isolateScope.user.displayName).toEqual('Karen');
  }));
  
  it('should update displayName when lastName is changed', inject(function () {
    isolateScope.user.lastName = 'Mason';
    isolateScope.$digest();
    expect(isolateScope.user.displayName).toEqual('Mason');
  }));
  
  it('should be equal to "[firstName] [lastName]"', inject(function () {
    isolateScope.user.firstName = 'Karen';
    isolateScope.user.lastName = 'Mason';
    isolateScope.$digest();
    expect(isolateScope.user.displayName).toEqual('Karen Mason');
  }));
  
  it('should stop updating when displayName is $touched', inject(function () {
    isolateScope.createUserForm.displayName.$touched = true;
    isolateScope.user.displayName = 'Karen M.';
    isolateScope.user.firstName = 'Susan';
    isolateScope.$digest();
    
    expect(isolateScope.user.displayName).toEqual('Karen M.');
  }));
});
