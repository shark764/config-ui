'use strict';

describe('toggleDirective', function(){
  var $scope,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    $scope.obj = {
      prop: 'test1'
    };
    
    $scope.bool = false;
    
    element = $compile('<toggle ng-model="obj" ng-disabled="bool"></toggle>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));
  
  it('should do something', function() {
    var isolateScope = element.isolateScope();
    expect(isolateScope.ngModel).toBe($scope.obj);
    expect(isolateScope.ngDisabled).toBe($scope.bool);
  });
  
  it('should set a default falseValue and trueValue if none are given', function() {
    expect(isolateScope.falseValue).toEqual(false);
    expect(isolateScope.trueValue).toEqual(true);
  });
  
  describe('onClick function', function(){
    it('should show a confirm modal if toggled to false and confirmMessage is given', inject(['Modal', function(Modal) {
      isolateScope.confirmMessage = 'Show the thing';
      spyOn(Modal, 'showConfirm');
      
      isolateScope.onClick(false);
      expect(Modal.showConfirm).toHaveBeenCalled();
    }]));
    
    it('should do nothing if not given a confirmMessage', inject(['Modal', function(Modal) {
      spyOn(Modal, 'showConfirm');
      
      isolateScope.onClick(false);
      expect(Modal.showConfirm).not.toHaveBeenCalled();
    }]));
    
    it('should do nothing if toggled to true', inject(['Modal', function(Modal) {
      isolateScope.confirmMessage = 'Show the thing';
      spyOn(Modal, 'showConfirm');
      
      isolateScope.onClick(true);
      expect(Modal.showConfirm).not.toHaveBeenCalled();
    }]));
    
    it('should leave ngModel as false if user clicks ok on the modal', inject(['Modal', function(Modal) {
      isolateScope.confirmMessage = 'Show the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(config){
        config.okCallback();
      });
      
      isolateScope.ngModel = false;
      isolateScope.onClick(false);
      expect(isolateScope.ngModel).toBeFalsy();
    }]));
    
    it('should set ngModel to true if user clicks cancel on the modal', inject(['Modal', function(Modal) {
      isolateScope.confirmMessage = 'Show the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(config){
        config.cancelCallback();
      });
      
      isolateScope.ngModel = false;
      isolateScope.onClick(false);
      expect(isolateScope.ngModel).toBeTruthy();
    }]));
  });
});