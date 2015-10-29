'use strict';

describe('tooltip directive', function(){
  var $scope,
    isolateScope,
    $compile,
    element,
    $document
    ;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock'));

  beforeEach(inject(['$compile', '$rootScope', '$document', '$timeout', function(_$compile_, $rootScope, _$document_, $timeout) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $document = _$document_;

    var offsetSpy = jasmine.createSpy('offset').and.returnValue({left: 0, top: 0});
    var heightSpy = jasmine.createSpy('height').and.returnValue(10);
    var widthSpy = jasmine.createSpy('width').and.returnValue(15);
    $scope.myItem = {
      offset: offsetSpy,
      outerHeight: heightSpy,
      outerWidth: widthSpy
    };
    
    element = $compile('<tooltip text="my tooltip text" target="myItem"></tooltip>')($scope);
    $scope.$digest();
    $timeout.flush();
    
    isolateScope = element.isolateScope();
  }]));

  it('should render the text', inject(function() {
    expect(element.text()).toEqual('my tooltip text');
  }));
  
  describe('getPositionClass function', function(){
    beforeEach(function(){
      spyOn($document, 'width').and.returnValue(100);
      spyOn($document, 'height').and.returnValue(100);
      isolateScope.tooltipHeight = 20;
      isolateScope.tooltipWidth = 20;
    });
    
    it('should return "bottom right" if element is near top left corner of document', inject(function() {
      isolateScope.targetPosition.top = 0;
      isolateScope.targetPosition.left = 0;
      expect(isolateScope.getPositionClass()).toEqual('bottom right');
      
      isolateScope.targetPosition.top = 10;
      isolateScope.targetPosition.left = 10;
      expect(isolateScope.getPositionClass()).toEqual('bottom right');
    }));
    
    it('should return "bottom left" if element is near top right corner of document', inject(function() {
      isolateScope.targetPosition.top = 0;
      isolateScope.targetPosition.left = 100;
      expect(isolateScope.getPositionClass()).toEqual('bottom left');
      
      isolateScope.targetPosition.top = 10;
      isolateScope.targetPosition.left = 90;
      expect(isolateScope.getPositionClass()).toEqual('bottom left');
    }));
    
    it('should return "bottom center" if element is near top of the document and not near a side', inject(function() {
      isolateScope.targetPosition.top = 0;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('bottom center');
      
      isolateScope.targetPosition.top = 10;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('bottom center');
    }));
    
    it('should return "top right" if element is near bottom left of the document', inject(function() {
      isolateScope.targetPosition.top = 100;
      isolateScope.targetPosition.left = 0;
      expect(isolateScope.getPositionClass()).toEqual('top right');
      
      isolateScope.targetPosition.top = 90;
      isolateScope.targetPosition.left = 10;
      expect(isolateScope.getPositionClass()).toEqual('top right');
    }));
    
    it('should return "top left" if element is near bottom right of the document', inject(function() {
      isolateScope.targetPosition.top = 100;
      isolateScope.targetPosition.left = 100;
      expect(isolateScope.getPositionClass()).toEqual('top left');
      
      isolateScope.targetPosition.top = 90;
      isolateScope.targetPosition.left = 90;
      expect(isolateScope.getPositionClass()).toEqual('top left');
    }));
    
    it('should return "top center" if element is near bottom of the document and not near a side', inject(function() {
      isolateScope.targetPosition.top = 100;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('top center');
      
      isolateScope.targetPosition.top = 90;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('top center');
    }));
    
    it('should return "center right" if element is near the left of the document but not near top or bottom', inject(function() {
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 0;
      expect(isolateScope.getPositionClass()).toEqual('center right');
      
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 10;
      expect(isolateScope.getPositionClass()).toEqual('center right');
    }));
    
    it('should return "center left" if element is near the right of the document but not near top or bottom', inject(function() {
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 100;
      expect(isolateScope.getPositionClass()).toEqual('center left');
      
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 90;
      expect(isolateScope.getPositionClass()).toEqual('center left');
    }));
    
    it('should return "top center" if element is not near any edge', inject(function() {
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 50;
      expect(isolateScope.getPositionClass()).toEqual('top center');
      
      isolateScope.targetPosition.top = 40;
      isolateScope.targetPosition.left = 70;
      expect(isolateScope.getPositionClass()).toEqual('top center');
    }));
  });
  
  describe('getAbsolutePosition function', function(){
    var arrowHeight = 15;
    var arrowWidth = 13;
    var arrowBase = 25;
    var targetHeight = 10;
    var targetWidth = 15;
    var tooltipHeight = 20;
    var tooltipWidth = 30;
    
    beforeEach(function(){
      isolateScope.tooltipHeight = tooltipHeight;
      isolateScope.tooltipWidth = tooltipWidth;
      isolateScope.targetPosition.top = 50;
      isolateScope.targetPosition.left = 50;
    });
    
    it('should return coordinates to the bottom right of target when given "bottom right"', inject(function() {
      var position = isolateScope.getAbsolutePosition('bottom right');
      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50 + targetWidth + arrowWidth);
    }));
    
    it('should return coordinates to the bottom left of target when given "bottom left"', inject(function() {
      var position = isolateScope.getAbsolutePosition('bottom left');
      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50 - tooltipWidth - arrowWidth);
    }));
    
    it('should return coordinates to the bottom center of target when given "bottom center"', inject(function() {
      var position = isolateScope.getAbsolutePosition('bottom center');
      expect(position.top).toEqual(50 + targetHeight + arrowHeight);
      
      var targetCenter =  50 + 7.5;
      var tooltipHalfWidth = 15;
      expect(position.left).toEqual(targetCenter - tooltipHalfWidth);
    }));
    
    it('should return coordinates to the top right of target when given "top right"', inject(function() {
      var position = isolateScope.getAbsolutePosition('top right');
      expect(position.top).toEqual(50 - tooltipHeight + arrowBase);
      expect(position.left).toEqual(50 + targetWidth + arrowWidth);
    }));
    
    it('should return coordinates to the top left of target when given "top left"', inject(function() {
      var position = isolateScope.getAbsolutePosition('top left');
      expect(position.top).toEqual(50 - tooltipHeight + arrowBase);
      expect(position.left).toEqual(50 - tooltipWidth - arrowWidth);
    }));
    
    it('should return coordinates to the top center of target when given "top center"', inject(function() {
      var position = isolateScope.getAbsolutePosition('top center');
      expect(position.top).toEqual(50 - (tooltipHeight + arrowHeight));
      
      var targetCenter =  50 + 7.5;
      var tooltipHalfWidth = 15;
      expect(position.left).toEqual(targetCenter - tooltipHalfWidth);
    }));
    
    it('should return coordinates to the right of target when given "center right"', inject(function() {
      var position = isolateScope.getAbsolutePosition('center right');
      
      var targetCenter =  50 + 5;
      var tooltipHalfHeight = 10;
      expect(position.top).toEqual(targetCenter - tooltipHalfHeight);
      
      expect(position.left).toEqual(50 + targetWidth + arrowWidth);
    }));
    
    it('should return coordinates to the right of target when given "center left"', inject(function() {
      var position = isolateScope.getAbsolutePosition('center left');
      
      var targetCenter =  50 + 5;
      var tooltipHalfHeight = 10;
      expect(position.top).toEqual(targetCenter - tooltipHalfHeight);
      
      expect(position.left).toEqual(50 - (tooltipWidth + arrowWidth));
    }));
    
    it('should return the target elements coordinates when given an unsupported value', inject(function() {
      var position = isolateScope.getAbsolutePosition('center center');

      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50);
      
      position = isolateScope.getAbsolutePosition('foo');

      expect(position.top).toEqual(50);
      expect(position.left).toEqual(50);
    }));
  });
});
