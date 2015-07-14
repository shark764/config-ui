'use strict';

describe('dropdown directive', function(){
  var $scope,
    $compile,
    $document,
    element,
    items,
    isolateScope,
    hoverControllerSpy;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', '$document', function(_$compile_,_$rootScope_, _$document_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $document = _$document_;
    
    items = [
             {label: 'One'},
             {label: 'Another'}
            ];
    $scope.items = items;
  }]));
  
  it('should add an li item for each item given', inject(function() {
    element = $compile('<dropdown label="My Dropdown" items="items"></dropdown>')($scope);
    $scope.$digest();
    expect(element.find('li').length).toEqual(2);
  }));
  
  describe('optionClick function', function(){
    beforeEach(function(){
      element = $compile('<dropdown label="My Dropdown" items="items"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    });
    
    it('should call the given function', inject(function() {
      var clickSpy = jasmine.createSpy('optionClick');
      isolateScope.optionClick(clickSpy);
      
      expect(clickSpy).toHaveBeenCalled();
    }));
    
    it('should hide the dropdown', inject(function() {
      isolateScope.showDrop = true;
      isolateScope.optionClick(angular.noop);
      expect(isolateScope.showDrop).toBeFalsy();
    }));
  });
  
  it('should add the controller to hoverTracker if given', inject(function() {
    $scope.hovering = false;
    $scope.hovers = [];
    element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering" hover-tracker="hovers"></dropdown>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
    
    expect($scope.hovers.length).toBe(1);
  }));
  
  describe('clearOtherHovers function', function(){
    beforeEach(function(){
      hoverControllerSpy = jasmine.createSpyObj('controller', ['setShowDrop']);
      $scope.hovering = false;
      $scope.hovers = [hoverControllerSpy];
      element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering" hover-tracker="hovers"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    });
    
    it('should set show drop to false for all other controllers', inject(function() {
      isolateScope.clearOtherHovers();
      expect(hoverControllerSpy.setShowDrop).toHaveBeenCalledWith(false);
    }));
    
    it('should leave showdrop intact for the current controller', inject(function() {
      isolateScope.showDrop = true;
      isolateScope.clearOtherHovers();
      expect(isolateScope.showDrop).toBeTruthy();
    }));
  });
  
  describe('mouseIn function', function(){
    beforeEach(function(){
      $scope.hovering = false;
      element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      spyOn(isolateScope, 'clearOtherHovers');
    });
    
    it('should call clearOtherHovers and showDrop when hovering', inject(function() {
      isolateScope.hovering = true;
      isolateScope.mouseIn();
      expect(isolateScope.showDrop).toBeTruthy();
      expect(isolateScope.clearOtherHovers).toHaveBeenCalled();
    }));
    
    it('should do nothing if hovering', inject(function() {
      isolateScope.hovering = false;
      isolateScope.mouseIn();
      expect(isolateScope.showDrop).toBeFalsy();
      expect(isolateScope.clearOtherHovers).not.toHaveBeenCalled();
    }));
  });
  
  describe('dropClick function', function(){
    beforeEach(function(){
      element = $compile('<dropdown label="My Dropdown" items="items" hovering="hovering"></dropdown>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    });
    
    it('should toggle showDrop', inject(function() {
      isolateScope.showDrop = true;
      isolateScope.dropClick();
      expect(isolateScope.showDrop).toBeFalsy();
      
      isolateScope.showDrop = false;
      isolateScope.dropClick();
      expect(isolateScope.showDrop).toBeTruthy();
    }));
    
    it('should toggle hovering', inject(function() {
      isolateScope.hovering = true;
      isolateScope.dropClick();
      expect(isolateScope.hovering).toBeFalsy();
      
      isolateScope.hovering = false;
      isolateScope.dropClick();
      expect(isolateScope.hovering).toBeTruthy();
    }));
  });
});
