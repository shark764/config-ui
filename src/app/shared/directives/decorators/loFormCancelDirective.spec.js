'use strict';

describe('loFormCancel directive', function() {
  var $scope,
    detailsPanelElement,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope',
    function($compile, $rootScope) {
      $scope = $rootScope.$new();

      $scope.ngResource = {};

      // detailsPanelElement = $compile('<lo-details-panel></lo-details-panel>')($scope);
      element = $compile('<ng-form lo-details-panel ng-resource="ngResource" lo-form-cancel="chain1"></ng-form>')($scope);

      // detailsPanelElement.append(element);

      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  it('should hook itself onto chain1', inject(['$cacheFactory', function($cacheFactory) {
    var chain = $cacheFactory.get('chains').get('chain1');
    expect(chain).toBeDefined();
    expect(chain.length).toEqual(1);
  }]));

  describe('ON chain1.execute', function() {
    describe('WHERE ngResource is new', function() {
      beforeEach(function() {
        spyOn(isolateScope.ngResource, 'isNew').and.returnValue(true);
      });

      //TODO: continue
    });
  })
});
