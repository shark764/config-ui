'use strict';

describe('confirmToggleDirective', function(){
  var $scope,
    element,
    $q;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$q', function($compile, $rootScope, _$q_) {
    $q = _$q_;
    $scope = $rootScope.$new();
    
    $scope.model = false;
    
    $scope.bool = false;
    
    element = $compile('<toggle confirm-toggle ng-model="model" confirm-enable-message="Are you sure?" confirm-disable-message="Really sure"?></toggle>')($scope);
    $scope.$digest();
  }]));
  
  describe('onToggle function', function(){
    it('should show a confirm modal if toggled to false', inject(['Modal', function(Modal) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(){
        var deferred = $q.defer();
        deferred.resolve('true');
        return deferred.promise;
      });
      
      $scope.onToggle(false);
      expect(Modal.showConfirm).toHaveBeenCalled();
    }]));
    
    it('should show a confirm modal if toggled to true', inject(['Modal', function(Modal) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(){
        var deferred = $q.defer();
        deferred.resolve('true');
        return deferred.promise;
      });
      
      $scope.onToggle(true);
      expect(Modal.showConfirm).toHaveBeenCalled();
    }]));
    
    it('should toggle ngModel as false if user clicks ok on the modal', inject(['Modal', function(Modal) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      
      var deferred = $q.defer();
      deferred.resolve('true');
      spyOn(Modal, 'showConfirm').and.returnValue(deferred.promise);
      
      $scope.ngModel = false;
      $scope.onToggle(false);
      expect($scope.ngModel).toBeFalsy();
    }]));
    
    it('should leave ngModel to true if user clicks cancel on the modal', inject(['Modal', '$timeout', function(Modal, $timeout) {
      $scope.confirmEnableMessage = 'Show the thing';
      $scope.confirmDisableMessage = 'Do not do the thing';
      spyOn(Modal, 'showConfirm').and.callFake(function(){
        var deferred = $q.defer();
        deferred.reject('false');
        return deferred.promise;
      });
      
      $scope.falseValue = false;
      $scope.trueValue = true;
      $scope.ngModel = false;
      $scope.onToggle(false);
      $timeout.flush();
      expect($scope.$parent.ngModel).toBeTruthy();
    }]));
  });
});