'use strict';

describe('disableContents directive', function(){
  var $scope,
    $compile,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  
  beforeEach(inject(['$compile', '$rootScope', function(_$compile, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile;
  }]));
  
  it('should disable all inputs in the element when expression is true', function() {
    element = $compile('<div disable-contents="true"><input type="text"></input><input type="url"></input></div>')($scope);
    $scope.$digest();
    
    var inputs = element.find('input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].hasAttribute('disabled')).toBeTruthy();
    expect(inputs[1].hasAttribute('disabled')).toBeTruthy();
  });
  
  it('should not disable inputs in the element when expression is false', function() {
    element = $compile('<div disable-contents="false"><input type="text"></input><input type="url"></input></div>')($scope);
    $scope.$digest();
    
    var inputs = element.find('input');
    expect(inputs.length).toBe(2);
    expect(inputs[0].hasAttribute('disabled')).toBeFalsy();
    expect(inputs[1].hasAttribute('disabled')).toBeFalsy();
  });
  
  it('should disable all labels in the element when expression is true', function() {
    element = $compile('<div disable-contents="true"><label></label></div>')($scope);
    $scope.$digest();
    
    var labels = element.find('label');
    expect(labels.length).toBe(1);
    expect(labels[0].hasAttribute('disabled')).toBeTruthy();
  });
  
  it('should not disable labels in the element when expression is false', function() {
    element = $compile('<div disable-contents="false"><label></label></div>')($scope);
    $scope.$digest();
    
    var labels = element.find('label');
    expect(labels.length).toBe(1);
    expect(labels[0].hasAttribute('disabled')).toBeFalsy();
  });
  
  it('should not overwrite existing ng-disabled attributes', function() {
    element = $compile('<div disable-contents="true"><input ng-disabled="myVal"></input></div>')($scope);
    $scope.$digest();
    
    var inputs = element.find('input');
    expect(inputs.length).toBe(1);
    expect(inputs.attr('ng-disabled')).toEqual('myVal || true');
  });
});