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
        'lo-form-cancel="chain-cancel" name="form1"><input ng-model="ngResource.email" ' +
        'name="email" type="email" required></ng-form></div>';
    }
  ]));

  describe('directive.link', function() {
    it('should hook itself onto chain1', inject(['$compile', '$cacheFactory', function($compile, $cacheFactory) {
      var element = angular.element(elementString);
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      var chain = $cacheFactory.get('chains').get('chain1');
      expect(chain).toBeDefined();
      expect(chain.length).toEqual(2);
    }]));
  });


  describe('ON submit success', function() {
    beforeEach(inject(['$compile', '$q', 'Chain', function($compile, $q, Chain) {
      Chain.get('chain1').hook('success', function() {
        return $q.when();
      }, 1);

      element = angular.element(elementString);
      element.data('$loDetailsPanelController', {
        close: jasmine.createSpy()
      });

      $compile(element)($scope);

      $scope.$digest();
      isolateScope = element.find('ng-form').scope();

      loFormSubmitController = element.find('ng-form').controller('loFormSubmit');
    }]));
    
    it('should reset the form', inject(['Chain', '$timeout', function(Chain, $timeout) {
      var loFormCancelController = element.find('ng-form').controller('loFormCancel');
      var formController = element.find('ng-form').controller('form');
      
      spyOn(loFormCancelController, 'resetForm');

      Chain.get('chain1').execute();
      $timeout.flush();

      expect(loFormCancelController.resetForm).toHaveBeenCalledWith(formController);
    }]));
    
    it('should raise an event', inject(['Chain', '$timeout', function(Chain, $timeout) {
      spyOn(isolateScope, '$emit');

      Chain.get('chain1').execute();
      $timeout.flush();

      expect(isolateScope.$emit).toHaveBeenCalledWith('form:submit:success', undefined);
    }]));
  });

  describe('ON submit fail', function() {
    var error,
      formController;

    beforeEach(inject(['$compile', '$q', '$timeout', 'Chain', function($compile, $q, $timeout, Chain) {
      error = {
        data: {
          error: {
            attribute: {
              email: 'Invalid email.'
            }
          }
        }
      };

      Chain.get('chain1').hook('failure', function() {
        var deferred = $q.defer();
        $timeout(function() {
          deferred.reject(error);
        });
        return deferred.promise;
      }, 1);

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

    it('should $setValidity for field', inject(['Chain', '$timeout',
      function(Chain, $timeout) {
        spyOn(formController.email, '$setValidity');
        Chain.get('chain1').execute();
        $timeout.flush();

        expect(formController.email.$setValidity).toHaveBeenCalledWith('api', false);
      }
    ]));

    it('should set $error for field', inject(['Chain', '$timeout',
      function(Chain, $timeout) {
        Chain.get('chain1').execute();
        $timeout.flush();

        expect(formController.email.$error).toEqual({
          api: 'Invalid email.'
        });
      }
    ]));

    it('should $setTouched for field', inject(['Chain', '$timeout',
      function(Chain, $timeout) {
        spyOn(formController.email, '$setTouched');
        Chain.get('chain1').execute();
        $timeout.flush();

        expect(formController.email.$setTouched).toHaveBeenCalled();
      }
    ]));

    it('should do nothing if error is none-standard', inject(['Chain', '$timeout',
      function(Chain, $timeout) {
        error.data = undefined;
        spyOn(formController.email, '$setValidity');
        spyOn(formController.email, '$setTouched');

        Chain.get('chain1').execute();
        $timeout.flush();

        expect(formController.email.$setValidity).not.toHaveBeenCalled();
        expect(formController.email.$setTouched).not.toHaveBeenCalled();
      }
    ]));

    it('should raise an event', inject(['Chain', '$timeout', function(Chain, $timeout) {
      spyOn(isolateScope, '$emit');

      Chain.get('chain1').execute();
      $timeout.flush();

      expect(isolateScope.$emit).toHaveBeenCalledWith('form:submit:failure', error);
    }]));
  });
});
