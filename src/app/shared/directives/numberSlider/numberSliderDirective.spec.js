'use strict';

describe('numberSlider directive', function(){
  var $scope,
    element,
    isolateScope,
    doCompile;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', function($compile,_$rootScope_) {
    $scope = _$rootScope_.$new();
    
    $scope.value = null;
    $scope.placeholder = 'enter a value';
    $scope.hasHandles = true;
    
    doCompile = function(){
      element = $compile('<number-slider value="value" placeholder="{{placeholder}}" has-handles="hasHandles"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));

  it('should add an input', inject(function() {
    doCompile();
    expect(element.find('input').length).toEqual(1);
  }));
  
  it('should set min and max values to null if not defined', inject(function() {
    doCompile();
    
    expect(isolateScope.minValue).toBeNull();
    expect(isolateScope.maxValue).toBeNull();
  }));
  
  describe('value watch', function(){
    it('should convert string to number', inject(function() {
      doCompile();
      
      $scope.value = 'v44';
      $scope.$digest();
      expect($scope.value).toEqual(44);
      
      $scope.value = '3';
      $scope.$digest();
      expect($scope.value).toEqual(3);
      
      $scope.value = '     3';
      $scope.$digest();
      expect($scope.value).toEqual(3);
    }));
    
    it('should allow negative numbers', inject(function() {
      doCompile();
      
      $scope.value = '-3';
      $scope.$digest();
      expect($scope.value).toEqual(-3);
    }));
    
    it('should allow floating point numbers', inject(function() {
      doCompile();
      
      $scope.value = '4.2';
      $scope.$digest();
      expect($scope.value).toEqual(4.2);
    }));
    
    it('should enforce the max value', inject(['$compile', function($compile) {
      $scope.maxValue = 5;
      $scope.value = 10;
      element = $compile('<number-slider min-value="{{minValue}}" max-value="{{maxValue}}" value="value" placeholder="{{placeholder}}" has-handles="hasHandles"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      expect($scope.value).toEqual(5);
      
      $scope.value = 30;
      $scope.$digest();
      expect($scope.value).toEqual(5);
    }]));
    
    it('should enforce the min value', inject(['$compile', function($compile) {
      $scope.minValue = 0;
      $scope.value = -1;
      
      element = $compile('<number-slider min-value="{{minValue}}" max-value="{{maxValue}}" value="value" placeholder="{{placeholder}}" has-handles="hasHandles"></number-slider>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      
      expect($scope.value).toEqual(0);
      
      $scope.value = -15;
      $scope.$digest();
      expect($scope.value).toEqual(0);
    }]));
  });
  
  describe('increment function', function(){
    it('should increase value by 1', inject(function() {
      doCompile();

      isolateScope.value = '1';
      isolateScope.increment();
      expect(isolateScope.value).toEqual(2);
    }));
    
    it('should set value to 1 if it is null', inject(function() {
      doCompile();
      
      isolateScope.value = null;
      isolateScope.increment();
      expect(isolateScope.value).toEqual(1);
    }));
  });
  
  describe('decrement function', function(){
    it('should decrease value by 1', inject(function() {
      doCompile();
      
      isolateScope.value = '1';
      isolateScope.decrement();
      expect(isolateScope.value).toEqual(0);
    }));
    
    it('should set value to -1 if it is null', inject(function() {
      doCompile();
      
      isolateScope.value = null;
      isolateScope.decrement();
      expect(isolateScope.value).toEqual(-1);
    }));
  });
});
