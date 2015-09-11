'use strict';

describe('loFormCancel directive', function() {
  var $scope,
    element,
    isolateScope,
    loFormCancelController;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', 'DirtyForms',
    function($compile, $rootScope, DirtyForms) {
      $scope = $rootScope.$new();

      $scope.ngResource = {
        email: 'test@tester.com',
        isNew: jasmine.createSpy('ngResource.isNew').and.callThrough(),
        reset: jasmine.createSpy('ngResource.isNew').and.callThrough()
      };

      //http://stackoverflow.com/questions/19227036/testing-directives-that-require-controllers
      element = angular.element('<div><ng-form ng-resource="ngResource" lo-form-cancel="chain1" name="form1"><input ng-model="ngResource.email" name="email" type="email" required></ng-form></div>');
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      $scope.$digest();
      isolateScope = element.find('ng-form').scope();

      loFormCancelController = element.find('ng-form').controller('loFormCancel');

      spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function(callback) {
        callback();
      });
    }
  ]));

  beforeEach(function() {
    isolateScope.ngResource.isNew = jasmine.createSpy('ngResource.isNew');
    isolateScope.ngResource.reset = jasmine.createSpy('ngResource.reset');
  });

  describe('ON ngResource change', function() {
    beforeEach(function() {
      loFormCancelController.resetForm = jasmine.createSpy('loFormCancelController.resetForm');
    });

    it('should call resetForm on ngResource change', function() {
      var oldResource = isolateScope.ngResource;
      isolateScope.ngResource = {
        isNew: jasmine.createSpy('new ngResource.isNew'),
        reset: jasmine.createSpy('new ngResource.reset'),
        email: 'new@tester.com'
      };

      isolateScope.$digest();

      expect(loFormCancelController.resetForm).toHaveBeenCalled();
      expect(oldResource.reset).toHaveBeenCalled();
    });
  });

  describe('ON controller.resetForm', function() {
    var formController;

    beforeEach(function() {
      formController = element.find('ng-form').controller('form');
      spyOn(formController, '$setPristine');
      spyOn(formController, '$setUntouched');

      spyOn(formController.email, '$setViewValue');
      spyOn(formController.email, '$rollbackViewValue');
    });

    it('should always $setPristine and $setUntouched on call', function() {
      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();
    });

    it('should not $setViewValue to displayValue and $rollbackViewValue if field is valid', function() {
      loFormCancelController.resetForm(formController);
      expect(formController.email.$setViewValue).not.toHaveBeenCalled();
      expect(formController.email.$rollbackViewValue).not.toHaveBeenCalled();
    });

    it('should $setViewValue to displayValue and $rollbackViewValue if field is invalid', function() {
      isolateScope.ngResource.email = 'test@';
      isolateScope.$digest();

      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();

      expect(formController.email.$setViewValue).toHaveBeenCalled();
      expect(formController.email.$rollbackViewValue).toHaveBeenCalled();
    });

    it('should $setViewValue to undefined if displayValue is null', function() {
      isolateScope.ngResource.email = null;
      isolateScope.$digest();

      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();

      expect(formController.email.$setViewValue).toHaveBeenCalledWith(undefined);
      expect(formController.email.$rollbackViewValue).toHaveBeenCalled();
    });
  });

  describe('ON controller.cancel', function() {
    beforeEach(function() {
      spyOn(loFormCancelController, 'resetForm');
    });

    describe('WHERE ngResource is new', function() {
      beforeEach(function() {
        isolateScope.ngResource.isNew = jasmine.createSpy('ngReource.isNew').and.returnValue(true);
      });

      it('should call detailsPanel.close when form is clean', inject([function() {
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
        loFormCancelController.cancel();
        expect(element.controller('loDetailsPanel').close).toHaveBeenCalled();
        expect(loFormCancelController.resetForm).not.toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
      }]));

      it('should not call detailsPanel.close when form is dirty', inject([function() {
        element.find('ng-form').controller('form').$setDirty();
        loFormCancelController.cancel();
        expect(element.controller('loDetailsPanel').close).toHaveBeenCalled();
        expect(loFormCancelController.resetForm).not.toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
      }]));
    });

    describe('WHERE ngResource is not new and form is dirty', function() {
      beforeEach(function() {
        isolateScope.ngResource.isNew = jasmine.createSpy('ngReource.isNew').and.returnValue(false);
        element.find('ng-form').controller('form').$setDirty();
      });

      it('should call loFormCancel.resetForm and resource.reset', inject(['$timeout', function($timeout) {
        loFormCancelController.cancel();
        $timeout.flush();
        expect(loFormCancelController.resetForm).toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).toHaveBeenCalled();
      }]));
    });
  });
});
