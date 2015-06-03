'use strict';

/*global jasmine, spyOn : false */

describe('resizeHandle directive', function(){
  var $scope,
    $compile,
    $document,
    element,
    leftSpy,
    rightSpy;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', '$document', function(_$compile_,_$rootScope_, _$document_) {
    $scope = _$rootScope_.$new();
    $document = _$document_;
    $compile = _$compile_;
    
    var target = $compile('<div id="left" style="width: 300px;"></div><span id="right" style="width: 600px;"></span>')($scope);
    angular.element($document[0].body).append(target);
    element = $compile('<resize-handle left-element-id="left" right-element-id="right" right-min-width="0" left-min-width="0"></resize-handle>')($scope);
    $scope.$digest();
  }]));

  it('should add div with the resizable-handle class', inject(function() {
    var handle = element[0].querySelectorAll('.resizable-handle');
    expect(angular.element(handle).hasClass('resizable-handle')).toBe(true);
  }));
  
  it('should be call resizeElements on mousemove', inject(function() {
    element.triggerHandler( {type: 'mousedown', button: 1, preventDefault: function(){}});
    spyOn(element.isolateScope(), 'resizeElements');
    var event = {type: 'mousemove', pageX: 100};
    $document.triggerHandler(event);
    expect(element.isolateScope().resizeElements).toHaveBeenCalled();
  }));
  
  describe('Mousedown event', function(){
    it('should call prevent default when mouse button isn\'t 2', inject(function() {
      var event = {type: 'mousedown', button: 1, preventDefault: function(){}};
      spyOn(event, 'preventDefault');
      element.triggerHandler(event);
      expect(event.preventDefault).toHaveBeenCalled();
    }));
    
    it('should attach a mousemove handler when mouse button isn\'t 2', inject(function() {
      var event = {type: 'mousedown', button: 1};
      spyOn($document, 'on');
      element.triggerHandler(event);
      expect($document.on).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    }));
    
    it('should attach a mouseup handler when mouse button isn\'t 2', inject(function() {
      var event = {type: 'mousedown', button: 1};
      spyOn($document, 'on');
      element.triggerHandler(event);
      expect($document.on).toHaveBeenCalledWith('mouseup', jasmine.any(Function));
    }));

    it('shouldn\'t call prevent default when mouse button is 2', inject(function() {
      var event = {type: 'mousedown', button: 2, preventDefault: function(){}};
      spyOn(event, 'preventDefault');
      element.triggerHandler(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    }));
  });
  
  describe('resizeElements function', function(){
    beforeEach(function(){
      leftSpy = jasmine.createSpy('css');
      rightSpy = jasmine.createSpy('css');
      element.isolateScope().leftTargetElement = {css: leftSpy};
      element.isolateScope().rightTargetElement = {css: rightSpy};
    });
    
    it('should shrink the left element if mouseX is smaller', inject(function() {
      element.isolateScope().resizeElements(200, 600, 100);
      expect(leftSpy).toHaveBeenCalledWith('width', '100px');
    }));
    
    it('should move the right element to match the left element\s edge if mouseX is smaller ', inject(function() {
      element.isolateScope().resizeElements(200, 600, 100);
      expect(rightSpy).toHaveBeenCalledWith('left', '100px');
    }));
    
    it('should grow the left element if mouseX is larger', inject(function() {
      element.isolateScope().resizeElements(200, 600, 500);
      expect(leftSpy).toHaveBeenCalledWith('width', '500px');
    }));
    
    it('should move the right element to match the left element\s edge if mouseX is larger ', inject(function() {
      element.isolateScope().resizeElements(200, 600, 500);
      expect(rightSpy).toHaveBeenCalledWith('left', '500px');
    }));
  });
});
