'use strict';

describe('toggleDirective', function(){
  var $scope,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    $scope.model = false;
    
    $scope.bool = false;
    
    element = $compile('<toggle ng-model="model" ng-disabled="bool"></toggle>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));
  
  it('should do something', function() {
    var isolateScope = element.isolateScope();
    expect(isolateScope.ngModel).toBe($scope.model);
    expect(isolateScope.ngDisabled).toBe($scope.bool);
  });
  
  it('should set a default falseValue and trueValue if none are given', function() {
    expect(isolateScope.falseValue).toEqual(false);
    expect(isolateScope.trueValue).toEqual(true);
  });
  
  describe('onClick function', function(){
    it('should show a confirm modal if toggled to false and confirmMessage is given', inject(['Modal', function(Modal) {
      isolateScope.confirmEnableMessage = 'Show the thing';
      isolateScope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm');
      
      isolateScope.onClick(false);
      expect(Modal.showConfirm).toHaveBeenCalled();
    }]));
    
    it('should show a confirm modal if toggled to true and confirmMessage is given', inject(['Modal', function(Modal) {
      isolateScope.confirmEnableMessage = 'Show the thing';
      isolateScope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm');
      
      isolateScope.onClick(true);
      expect(Modal.showConfirm).toHaveBeenCalled();
    }]));
    
    it('should do nothing if not given a confirmMessage', inject(['Modal', function(Modal) {
      spyOn(Modal, 'showConfirm');
      
      isolateScope.onClick(false);
      expect(Modal.showConfirm).not.toHaveBeenCalled();
    }]));
    
    it('should toggle ngModel as false if user clicks ok on the modal', inject(['Modal', function(Modal) {
      isolateScope.confirmEnableMessage = 'Show the thing';
      isolateScope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(config){
        config.okCallback();
      });
      
      isolateScope.ngModel = false;
      isolateScope.onClick(false);
      expect(isolateScope.ngModel).toBeFalsy();
    }]));
    
    it('should leave ngModel to true if user clicks cancel on the modal', inject(['Modal', function(Modal) {
      isolateScope.confirmEnableMessage = 'Show the thing';
      isolateScope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(){
        angular.noop();
      });
      
      isolateScope.ngModel = false;
      isolateScope.onClick(false);
      expect(isolateScope.ngModel).toBeTruthy();
    }]));
  });
});