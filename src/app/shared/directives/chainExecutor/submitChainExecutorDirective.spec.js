'use strict';

describe('loSubmitChainExecutor directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  var chain;
  beforeEach(inject(['Chain', function(Chain) {
    chain = {
      execute: jasmine.createSpy('chain execute'),
      hook: jasmine.createSpy('chain hook')
    };

    spyOn(Chain, 'get').and.returnValue(chain);
  }]));

  describe('ON default event click', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<lo-details-panel><ng-form name="form1" lo-form-cancel lo-form-submit ng-resource><a lo-cancel-chain-executor="chain1"></a><ng-form></<lo-details-panel>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on click', function() {
      element.find('a').triggerHandler('click');
      expect(chain.execute).toHaveBeenCalled();
    });
  });

  describe('ON event dblclick', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<lo-details-panel><ng-form name="form1" lo-form-cancel lo-form-submit ng-resource><a event="dblclick" lo-cancel-chain-executor="chain1"></a><ng-form></<lo-details-panel>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on dblclick', function() {
      element.find('a').triggerHandler('dblclick');
      expect(chain.execute).toHaveBeenCalled();
    });

    it('should not execute on click', function() {
      element.find('a').triggerHandler('click');
      expect(chain.execute).not.toHaveBeenCalled();
    });
  });

  //TODO re-add these
  xit('should raise an event', inject(['$timeout', function($timeout) {
    spyOn(isolateScope, '$emit');

    loFormSubmitController.resetForm();
    $timeout.flush();

    expect(isolateScope.$emit).toHaveBeenCalledWith('form:submit:success', undefined);
  }]));

  xit('should raise an event', inject(['$timeout', function($timeout) {
    spyOn(isolateScope, '$emit');

    loFormSubmitController.populateApiErrors(error);
    $timeout.flush();

    expect(isolateScope.$emit).toHaveBeenCalledWith('form:submit:failure', error);
  }]));
});
