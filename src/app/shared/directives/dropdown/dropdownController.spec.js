'use strict';

/* global jasmine, spyOn: false */
describe('DropdownController', function() {
    var $scope,
        $document,
        controller,
        $element;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$rootScope', '$controller', '$document', '$httpBackend', 'apiHostname', function($rootScope, $controller, _$document_, $httpBackend, apiHostname) {
      $scope = $rootScope.$new();
      $document = _$document_;
      $element = {};
      
      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({});
      $httpBackend.when('POST', apiHostname + '/v1/login').respond({});
      
      controller = $controller('DropdownController', {'$scope': $scope, '$element' : $element});
    }]));

    it('should hide the dropdown to start', inject(function() {
      expect($scope.showDrop).toBeFalsy();
    }));
    
    it('should attach the click listener when showDrop becomes true', inject(function() {
      spyOn($document, 'on');
      $scope.showDrop = false;
      $scope.$digest();
      $scope.showDrop = true;
      $scope.$digest();
      expect($document.on).toHaveBeenCalledWith('click', jasmine.any(Function));
    }));
    
    describe('setShowDrop function', function(){
      it('should exist', inject(function() {
        expect(controller.setShowDrop).toBeDefined();
        expect(controller.setShowDrop).toEqual(jasmine.any(Function));
      }));
      
      it('should set the showDrop value', inject(function() {
        $scope.showDrop = false;
        controller.setShowDrop(true);
        expect($scope.showDrop).toBeTruthy();
        
        $scope.showDrop = true;
        controller.setShowDrop(false);
        expect($scope.showDrop).toBeFalsy();
      }));
    });
    
    describe('onClick function', function(){
      it('should exist', inject(function() {
        expect(controller.onClick).toBeDefined();
        expect(controller.onClick).toEqual(jasmine.any(Function));
      }));
      
      it('should set showDrop and Hovering to false when clicking outside the element', function() {
        $scope.showDrop = true;
        $scope.hovering = true;
        var elementSpy = jasmine.createSpyObj('$element', ['find']);
        $element.find = elementSpy.find.and.returnValue([]);
        
        controller.onClick({target: {}});
        expect($scope.showDrop).toBeFalsy();
        expect($scope.hovering).toBeFalsy();
      });
      
      it('should remove the click event listener', function() {
        spyOn($document, 'off');
        var elementSpy = jasmine.createSpyObj('$element', ['find']);
        $element.find = elementSpy.find.and.returnValue([]);
        
        controller.onClick({target: {}});
        expect($document.off).toHaveBeenCalledWith('click', jasmine.any(Function));
      });
      
      it('should do noting if clicking inside the element', function() {
        $scope.showDrop = true;
        $scope.hovering = true;
        spyOn($document, 'off');
        var elementSpy = jasmine.createSpyObj('$element', ['find']);
        $element.find = elementSpy.find.and.returnValue([true]);
        
        controller.onClick({target: {}});
        expect($scope.showDrop).toBeTruthy();
        expect($scope.hovering).toBeTruthy();
        expect($document.off).not.toHaveBeenCalled();
      });
    });
});