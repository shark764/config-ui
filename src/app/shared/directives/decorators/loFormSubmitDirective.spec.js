'use strict';

describe('loFormSubmit directive', function() {
  var $scope,
    element,
    isolateScope,
    loFormSubmitController,
    elementString;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$rootScope',
    function($rootScope) {
      $scope = $rootScope.$new();

      $scope.ngResource = {
        email: 'test@tester.com',
        isNew: jasmine.createSpy('ngResource.isNew'),
        reset: jasmine.createSpy('ngResource.reset')
      };

      elementString = '<div><ng-form ng-resource="ngResource" lo-form-submit="chain1"' +
        'lo-form-cancel name="form1"><input ng-model="ngResource.email" ' +
        'name="email" type="email" required></ng-form></div>';
    }
  ]));

  describe('ON resetForm', function() {
    beforeEach(inject(['$compile', '$q', function($compile, $q) {
      element = angular.element(elementString);
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      $scope.$digest();
      isolateScope = element.find('ng-form').scope();

      loFormSubmitController = element.find('ng-form').controller('loFormSubmit');
    }]));

    it('should reset the form', inject(['$timeout', function($timeout) {
      var loFormCancelController = element.find('ng-form').controller('loFormCancel');
      var formController = element.find('ng-form').controller('form');

      spyOn(loFormCancelController, 'resetForm');

      loFormSubmitController.resetForm();
      $timeout.flush();

      expect(loFormCancelController.resetForm).toHaveBeenCalledWith(formController);
    }]));
  });

  describe('ON populateApiErrors', function() {
    var error,
      formController;

    beforeEach(inject(['$compile', '$q', '$timeout', function($compile, $q, $timeout) {
      error = {
        data: {
          error: {
            attribute: {
              email: 'Invalid email.'
            }
          }
        }
      };

      element = angular.element(elementString);
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      $scope.$digest();
      isolateScope = element.find('ng-form').scope();

      formController = element.find('ng-form').controller('form');
      loFormSubmitController = element.find('ng-form').controller('loFormSubmit');
    }]));

    it('should $setValidity for field', inject(['$timeout',
      function($timeout) {
        spyOn(formController.email, '$setValidity');
        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$setValidity).toHaveBeenCalledWith('api', false);
      }
    ]));

    it('should set $error for field', inject(['$timeout',
      function( $timeout) {
        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$error).toEqual({
          api: 'Invalid email.'
        });
      }
    ]));

    it('should $setTouched for field', inject(['$timeout',
      function($timeout) {
        spyOn(formController.email, '$setTouched');
        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$setTouched).toHaveBeenCalled();
      }
    ]));

    it('should do nothing if error is none-standard', inject(['$timeout',
      function($timeout) {
        error.data = undefined;
        spyOn(formController.email, '$setValidity');
        spyOn(formController.email, '$setTouched');

        loFormSubmitController.populateApiErrors(error);
        $timeout.flush();

        expect(formController.email.$setValidity).not.toHaveBeenCalled();
        expect(formController.email.$setTouched).not.toHaveBeenCalled();
      }
    ]));
  });
});
