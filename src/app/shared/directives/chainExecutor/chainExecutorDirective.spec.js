'use strict';

describe('loChainExecutor directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  var chainExecuteSpy;
  beforeEach(inject(['Chain', function(Chain) {
    chainExecuteSpy = jasmine.createSpy('chain execute');
    spyOn(Chain, 'get').and.returnValue({
      execute: chainExecuteSpy
    });
  }]));

  describe('ON default event click', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<a lo-chain-executor="chain1"></a>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on click', function() {
      element.triggerHandler('click');
      expect(chainExecuteSpy).toHaveBeenCalled();
    });
  });

  describe('ON event dblclick', function() {
    beforeEach(inject(['$compile', '$rootScope',
      function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.event = undefined;

        element = $compile('<a lo-chain-executor="chain1" event="dblclick"></a>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      }
    ]));

    it('should execute on dblclick', function() {
      element.triggerHandler('dblclick');
      expect(chainExecuteSpy).toHaveBeenCalled();
    });

    it('should not execute on click', function() {
      element.triggerHandler('click');
      expect(chainExecuteSpy).not.toHaveBeenCalled();
    });
  });
});
