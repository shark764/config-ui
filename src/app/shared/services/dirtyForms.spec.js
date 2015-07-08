'use strict';

/*global spyOn, jasmine : false */

describe('DirtyForms service', function(){
  var DirtyForms;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['DirtyForms', function(_DirtyForms_) {
    DirtyForms = _DirtyForms_;
  }]));

  it('registerForm function should add the item to the forms list', inject(function() {
    DirtyForms.registerForm({name: 'Thename'});
    expect(DirtyForms.forms.length).toBe(1);
    expect(DirtyForms.forms[0].name).toEqual('Thename');
  }));

  it('removeForm function should add the item to the forms list', inject(function() {
    var formItem = {name: 'Thename'};
    DirtyForms.forms.push(formItem);
    expect(DirtyForms.forms.length).toBe(1);
    DirtyForms.removeForm(formItem);
    expect(DirtyForms.forms.length).toBe(0);
  }));

  describe('hasDirty function', function(){
    it('should return true if one form is dirty', inject(function() {
      DirtyForms.forms.push({$dirty: true}, {$dirty: false});
      expect(DirtyForms.hasDirty()).toBeTruthy();
    }));

    it('should return false if there are no forms', inject(function() {
      expect(DirtyForms.hasDirty()).toBeFalsy();
    }));

    it('should return false if none of the forms are dirty', inject(function() {
      DirtyForms.forms.push({$dirty: false}, {$dirty: false});
      expect(DirtyForms.hasDirty()).toBeFalsy();
    }));
  });

  describe('confirmIfDirty function', function(){
    it('should check the hasDirty function', inject(function() {
      spyOn(DirtyForms, 'hasDirty');
      DirtyForms.confirmIfDirty(angular.noop);
      expect(DirtyForms.hasDirty).toHaveBeenCalled();
    }));

    it('should call Alert.confirm if there is a dirty form', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm');
      spyOn(DirtyForms, 'hasDirty').and.returnValue(true);
      DirtyForms.confirmIfDirty(angular.noop);
      expect(Alert.confirm).toHaveBeenCalled();
    }]));

    it('should call the given function if confirm returns cancel', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback){
        cancelCallback();
      });

      spyOn(DirtyForms, 'hasDirty').and.returnValue(true);
      var callbackSpy = jasmine.createSpy('okcallback');
      DirtyForms.confirmIfDirty(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    }]));

    it('should do nothing if the confirm returns ok', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm').and.callFake(function(msg, okCallback, cancelCallback){
        okCallback();
      });

      spyOn(DirtyForms, 'hasDirty').and.returnValue(true);
      var callbackSpy = jasmine.createSpy('okcallback');
      DirtyForms.confirmIfDirty(callbackSpy);
      expect(callbackSpy).toHaveBeenCalled();
    }]));

    it('should not show the confirm alert if no forms are dirty', inject(['Alert', function(Alert) {
      spyOn(Alert, 'confirm');
      spyOn(DirtyForms, 'hasDirty').and.returnValue(false);
      DirtyForms.confirmIfDirty(angular.noop);
      expect(Alert.confirm).not.toHaveBeenCalled();
    }]));

    it('should immediately call the given function if no forms are dirty', inject([function() {
      spyOn(DirtyForms, 'hasDirty').and.returnValue(false);
      var callbackSpy = jasmine.createSpy('okcallback');
      DirtyForms.confirmIfDirty(callbackSpy);
      expect(callbackSpy).toHaveBeenCalled();
    }]));
  });
});
