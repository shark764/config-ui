'use strict';

/* global jasmine, spyOn: false */
describe('unsavedChangesWarning directive', function() {
  var $scope,
    element,
    doDefaultCompile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
    $scope = $rootScope.$new();
    
    doDefaultCompile = function(){
      element = $compile('<ng-form name="detailsForm" unsaved-changes-warning></ng-form>')($scope);
      $scope.$digest();
    };
  }]));
  
  it('should register the form with the DirtyForms service', inject(['DirtyForms', function(DirtyForms) {
    spyOn(DirtyForms, 'registerForm');
    doDefaultCompile();
    expect(DirtyForms.registerForm).toHaveBeenCalled();
  }]));
  
  it('should do nothing if there is no form controller', inject(['DirtyForms', '$compile', function(DirtyForms, $compile) {
    spyOn(DirtyForms, 'registerForm');
    element = $compile('<div unsaved-changes-warning></div>')($scope);
    $scope.$digest();
    expect(DirtyForms.registerForm).not.toHaveBeenCalled();
  }]));
  
  it('should unregister the form from the DirtyForms service when destroyed', inject(['DirtyForms', function(DirtyForms) {
    doDefaultCompile();
    var removeSpy = spyOn(DirtyForms, 'removeForm');
    $scope.$destroy();
    expect(removeSpy).toHaveBeenCalled();
  }]));
  
  it('should unregister the state listener when destroyed', inject(['DirtyForms', '$rootScope', function() {
    doDefaultCompile();
    var removeSpy = spyOn($scope, 'destroyStateListener');
    $scope.$destroy();
    expect(removeSpy).toHaveBeenCalled();
  }]));
  
  describe('$stateChangeStart handler', function(){
    beforeEach(function(){
      doDefaultCompile();
    });
    
    it('should popup a confirm alert if the form is dirty', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm');
      $scope.detailsForm.$dirty = true;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}}); //Event params are checked by auth/routeSecurity.js
      expect(Alert.confirm).toHaveBeenCalled();
    }]));
    
    it('should do nothing and allow the state change to happen on ok', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback){
        okCallback();
      });
      
      spyOn(angular, 'noop');
      $scope.detailsForm.$dirty = true;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      expect(angular.noop).toHaveBeenCalled();
    }]));
    
    it('should prevent the event on cancel', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback){
        cancelCallback();
      });
      
      $scope.detailsForm.$dirty = true;
      var event = $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      
      expect(event.defaultPrevented).toBeTruthy();
    }]));
    
    it('should do nothing if the form is not dirty', inject(['Alert', '$state', '$rootScope', function(Alert, $state, $rootScope) {
      spyOn(Alert, 'confirm');
      $scope.detailsForm.$dirty = false;
      $rootScope.$broadcast('$stateChangeStart', {next: {isPublic : true}});
      expect(Alert.confirm).not.toHaveBeenCalled();
    }]));
  });
  
  describe('onbeforeunload function', function(){
    beforeEach(function(){
      doDefaultCompile();
    });
    
    it('should set $window.onbeforeunload', inject(['$window', function($window) {
      expect($window.onbeforeunload).toBeDefined();
      expect($window.onbeforeunload).toEqual(jasmine.any(Function));
    }]));
    
    it('should set a message if the form is dirty', inject(['$window', function($window) {
      $scope.detailsForm.$dirty = true;
      expect($window.onbeforeunload()).toEqual(jasmine.any(String));
    }]));
    
    it('should do nothing if the form isn\'t dirty', inject(['$window', function($window) {
      $scope.detailsForm.$dirty = false;
      expect($window.onbeforeunload()).toBeUndefined();
    }]));
  });
});
