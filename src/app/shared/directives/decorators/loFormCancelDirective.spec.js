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
        isNew: function() {},
        reset: function() {},
        email: 'test@tester.com'
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

  it('should hook itself onto chain1', inject(['$cacheFactory', function($cacheFactory) {
    var chain = $cacheFactory.get('chains').get('chain1');
    expect(chain).toBeDefined();
    expect(chain.length).toEqual(1);
  }]));

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
      isolateScope.ngResource.email = 'test@'
      isolateScope.$digest();

      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();

      expect(formController.email.$setViewValue).toHaveBeenCalled();
      expect(formController.email.$rollbackViewValue).toHaveBeenCalled();
    });

    it('should $setViewValue to undefined if displayValue is null', function() {
      isolateScope.ngResource.email = null
      isolateScope.$digest();

      loFormCancelController.resetForm(formController);
      expect(formController.$setPristine).toHaveBeenCalled();
      expect(formController.$setUntouched).toHaveBeenCalled();

      expect(formController.email.$setViewValue).toHaveBeenCalledWith(undefined);
      expect(formController.email.$rollbackViewValue).toHaveBeenCalled();
    });
  });

  describe('ON chain1.execute', function() {
    beforeEach(function() {
      spyOn(loFormCancelController, 'resetForm');
      spyOn(isolateScope.ngResource, 'reset');
    });

    describe('WHERE ngResource is new', function() {
      beforeEach(function() {
        spyOn(isolateScope.ngResource, 'isNew').and.returnValue(true);
      });

      it('should call detailsPanel.close when form is clean', inject(['Chain', function(Chain) {
        Chain.get('chain1').execute();
        expect(element.controller('loDetailsPanel').close).toHaveBeenCalled();
        expect(loFormCancelController.resetForm).not.toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
      }]));

      it('should not call detailsPanel.close when form is dirty', inject(['Chain', function(Chain) {
        element.find('ng-form').controller('form').$setDirty();
        Chain.get('chain1').execute();
        expect(element.controller('loDetailsPanel').close).toHaveBeenCalled();
        expect(loFormCancelController.resetForm).not.toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).not.toHaveBeenCalled();
      }]));
    });

    describe('WHERE ngResource is not new and form is dirty', function() {
      beforeEach(function() {
        // spyOn(isolateScope.ngResource, 'isNew').and.returnValue(false);
        element.find('ng-form').controller('form').$setDirty();
      });

      it('should call loFormCancel.resetForm and resource.reset', inject(['Chain', function(Chain) {
        Chain.get('chain1').execute();
        expect(loFormCancelController.resetForm).toHaveBeenCalled();
        expect(isolateScope.ngResource.reset).toHaveBeenCalled();
      }]));
    });
  });
});
