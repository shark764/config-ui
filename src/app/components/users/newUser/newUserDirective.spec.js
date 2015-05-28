'use strict';

describe('newUser directive', function () {
  var $rootScope,
    $scope,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function ($compile, _$rootScope_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    element = $compile('<div new-user></div>')($scope);
    $scope.$digest();
  }]));

  it('should update displayName when firstName is changed', inject(function () {
    $scope.data.firstName = 'Karen';
    $scope.$digest();
    expect($scope.data.displayName).toEqual('Karen');
  }));
  
  it('should update displayName when lastName is changed', inject(function () {
    $scope.data.lastName = 'Mason';
    $scope.$digest();
    expect($scope.data.displayName).toEqual('Mason');
  }));
  
  it('should be equal to "[firstName] [lastName]"', inject(function () {
    $scope.data.firstName = 'Karen';
    $scope.data.lastName = 'Mason';
    $scope.$digest();
    expect($scope.data.displayName).toEqual('Karen Mason');
  }));
  
  it('should stop updating when displayName is $touched', inject(function () {
    $scope.createUserForm.displayName.$touched = true;
    $scope.data.displayName = 'Karen M.';
    $scope.data.firstName = 'Susan';
    $scope.$digest();
    
    expect($scope.data.displayName).toEqual('Karen M.');
  }));

  it('should not save if there is a validation error', inject(function () {
    spyOn($rootScope, '$emit');
    
    $scope.createUserForm.$invalid = true;
    $scope.ok();
    
    expect($rootScope.$emit).not.toHaveBeenCalled();
  }));
  
  it('should emit save event if the form is valid', inject(function () {
    spyOn($rootScope, '$emit');
    
    $scope.createUserForm.$valid = true;
    $scope.ok();
    
    expect($rootScope.$emit).toHaveBeenCalled();
  }));
});
