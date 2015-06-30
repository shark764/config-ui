'use strict';

/* global spyOn: false */

describe('resizable directive', function(){
  var $scope,
    $rootScope,
    $compile,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, _$rootScope_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $scope = $rootScope.$new();
  }]));
  
  it('should set the field name if given resizable-right', inject(function() {
    element = $compile('<div resizable resizable-right></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().fieldName).toEqual('rightWidth');
  }));
  
  it('should set the field name if given resizable-left', inject(function() {
    element = $compile('<div resizable resizable-left></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().fieldName).toEqual('leftWidth');
  }));
  
  it('should leave field name null if not given a side', inject(function() {
    element = $compile('<div resizable></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().fieldName).toBeNull();
  }));
  
  describe ('resizehandle:resize event handler', function(){
    it('should add the two-col class when width is larger than 700', inject(function() {
      element = $compile('<div resizable resizable-right></div>')($scope);
      $scope.$digest();
      $rootScope.$broadcast('resizehandle:resize', {rightWidth: 800});
      expect(element.hasClass('two-col')).toBeTruthy();
    }));
    
    it('should remove the two-col class when width is less than or equal to 700', inject(function() {
      element = $compile('<div resizable resizable-right></div>')($scope);
      $scope.$digest();
      
      element.addClass('two-col');
      $rootScope.$broadcast('resizehandle:resize', {rightWidth: 700});
      expect(element.hasClass('two-col')).toBeFalsy();
      
      element.addClass('two-col');
      $rootScope.$broadcast('resizehandle:resize', {rightWidth: 500});
      expect(element.hasClass('two-col')).toBeFalsy();
    }));
    
    it('should add the compact-view class when width is less than 450', inject(function() {
      element = $compile('<div resizable resizable-right></div>')($scope);
      $scope.$digest();
      $rootScope.$broadcast('resizehandle:resize', {rightWidth: 300});
      expect(element.hasClass('compact-view')).toBeTruthy();
    }));
    
    it('should remove the compact-view class when width is greater than or equal to 450', inject(function() {
      element = $compile('<div resizable resizable-right></div>')($scope);
      $scope.$digest();
      
      element.addClass('compact-view');
      $rootScope.$broadcast('resizehandle:resize', {rightWidth: 450});
      expect(element.hasClass('compact-view')).toBeFalsy();
      
      element.addClass('compact-view');
      $rootScope.$broadcast('resizehandle:resize', {rightWidth: 450});
      expect(element.hasClass('compact-view')).toBeFalsy();
    }));
  });
});
