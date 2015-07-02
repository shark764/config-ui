'use strict';

/*global jasmine, spyOn : false */

describe('Alert service', function(){
  var Alert,
    toastr;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['Alert', 'toastr', function(_Alert_, _toastr_) {
    Alert = _Alert_;
    toastr = _toastr_;
  }]));
  
  describe('error function', function(){
    it('should call toastr error', inject(function() {
      spyOn(toastr, 'error');
      Alert.error('message1', 'message2');
      expect(toastr.error).toHaveBeenCalledWith('message1', 'message2');
    }));
  });
  
  describe('success function', function(){
    it('should call toastr success', inject(function() {
      spyOn(toastr, 'success');
      Alert.success('message');
      expect(toastr.success).toHaveBeenCalledWith('message');
    }));
  });
  
  describe('warning function', function(){
    it('should call toastr warning', inject(function() {
      spyOn(toastr, 'warning');
      Alert.warning('message');
      expect(toastr.warning).toHaveBeenCalledWith('message');
    }));
  });
  
  describe('confirm function', function(){
    it('should pop up a window alert', inject(['$window', function($window) {
      spyOn($window, 'confirm');
      Alert.confirm('message');
      expect($window.confirm).toHaveBeenCalledWith('message');
    }]));
    
    it('should call onOk callback', inject(['$window', function($window) {
      spyOn($window, 'confirm').and.callFake(function(){
        return true;
      });
      
      var okSpy = jasmine.createSpy('ok');
      Alert.confirm('message', okSpy);
      expect(okSpy).toHaveBeenCalled();
    }]));
    
    it('should call onCancel callback', inject(['$window', function($window) {
      spyOn($window, 'confirm').and.callFake(function(){
        return false;
      });
      
      var cancelSpy = jasmine.createSpy('cancel');
      Alert.confirm('message', angular.noop, cancelSpy);
      expect(cancelSpy).toHaveBeenCalled();
    }]));
  });
});
