'use strict';

/*global spyOn : false */

describe('Modal service', function(){
  var Modal;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['Modal', function(_Modal_) {
    Modal = _Modal_;
  }]));
  
  describe('close function', function(){
    it('should remove all modal elements from the document', inject(['$document', function($document) {
      var removeSpy = jasmine.createSpy('remove');
      var findSpy = spyOn($document, 'find').and.returnValue({remove: removeSpy});
      Modal.close();
      expect(findSpy).toHaveBeenCalledWith('modal');
      expect(removeSpy).toHaveBeenCalled();
    }]));
  });
  
  describe('showConfirm function', function(){
    it('should add a modal element with defaults', inject(['$document', function($document) {
      var appendSpy = jasmine.createSpy('append');
      var findSpy = spyOn($document, 'find').and.returnValue({append: appendSpy});
      
      Modal.showConfirm();
      
      expect(findSpy).toHaveBeenCalledWith('body');
      var scopeObj = appendSpy.calls.mostRecent().args[0].scope();

      expect(scopeObj.title).toEqual('');
      expect(scopeObj.message).toEqual('');
      
      spyOn(Modal, 'close');
      scopeObj.okCallback();
      expect(Modal.close).toHaveBeenCalled();
      
      Modal.close.calls.reset();
      scopeObj.cancelCallback();
      expect(Modal.close).toHaveBeenCalled();
    }]));
    
    it('should allow setting of custom properties', inject(['$document', function($document) {
      var appendSpy = jasmine.createSpy('append');
      var findSpy = spyOn($document, 'find').and.returnValue({append: appendSpy});
      
      var cancelSpy = jasmine.createSpy('cancel');
      var okSpy = jasmine.createSpy('ok');
      
      Modal.showConfirm({
        title: 'my title',
        message: 'my message',
        okCallback: okSpy,
        cancelCallback: cancelSpy
      });
      
      expect(findSpy).toHaveBeenCalledWith('body');
      var scopeObj = appendSpy.calls.mostRecent().args[0].scope();

      expect(scopeObj.title).toEqual('my title');
      expect(scopeObj.message).toEqual('my message');
      
      spyOn(Modal, 'close');
      scopeObj.okCallback();
      expect(Modal.close).toHaveBeenCalled();
      expect(okSpy).toHaveBeenCalled();
      
      Modal.close.calls.reset();
      scopeObj.cancelCallback();
      expect(Modal.close).toHaveBeenCalled();
      expect(cancelSpy).toHaveBeenCalled();
    }]));
  });
});
