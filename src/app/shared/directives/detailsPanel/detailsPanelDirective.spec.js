'use strict';

/*global xit : false */

describe('loDetailsPanel directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$stateParams',
    function($compile, $rootScope, $stateParams) {
      $scope = $rootScope.$new();
      $scope.ngResource = {};

      element = $compile('<lo-details-panel ng-resource="ngResource"></lo-details-panel>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();

      $stateParams.id = 1;
    }
  ]));

  describe('ON close', function() {
    it('should exists', function() {
      expect(isolateScope.close).toBeDefined();
    });

    describe('WHEN confirmIfDirty passes', function() {
      beforeEach(inject(['DirtyForms', function(DirtyForms) {
        spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function(callback) {
          callback();
        });
      }]));

      xit('should nullify the $location search id', inject(['$stateParams', function($stateParams) {
        expect($stateParams.id).not.toBeNull();
        isolateScope.close();
        expect($stateParams.id).toBeNull();
      }]));

      it('should nullify the ngResource', function() {
        expect(isolateScope.ngResource).not.toBeNull();
        isolateScope.close();
        expect(isolateScope.ngResource).toBeNull();
      });
    });

    describe('WHEN confirmIfDirty fails', function() {
      beforeEach(inject(['DirtyForms', function(DirtyForms) {
        spyOn(DirtyForms, 'confirmIfDirty').and.callFake(function() {
          return;
        });
      }]));

      it('should not nullify the ngResource', function() {
        expect(isolateScope.ngResource).not.toBeNull();
        isolateScope.close();
        expect(isolateScope.ngResource).not.toBeNull();
      });
    });
  });
});
