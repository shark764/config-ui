'use strict';

describe('duplicateValidator directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', 'MediaCollection', function($compile, $rootScope, MediaCollection) {
    $scope = $rootScope.$new();
    $scope.resource = new MediaCollection({
      mediaMap: []
    });

    $scope.form = {};

    element = $compile('<div media-map-duplicate form="form" resource="resource"></div>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  describe('mediaMap watch', function() {
    it('should set the validity on all mediaMap form elements', function() {
      $scope.form.mapping0 = {
        $setValidity: jasmine.createSpy('mapping0Validity')
      };

      $scope.form.mapping1 = {
        $setValidity: jasmine.createSpy('mapping1Validity')
      };

      $scope.resource.mediaMap.push({
        lookup: 'Mapping 0'
      });

      $scope.resource.mediaMap.push({
        lookup: 'Mapping 1'
      });

      isolateScope.$digest();
      expect($scope.form.mapping0.$setValidity).toHaveBeenCalled();
      expect($scope.form.mapping1.$setValidity).toHaveBeenCalled();
    });

    it('should set duplicate named mappings invalid', function() {
      $scope.form.mapping0 = {
        $setValidity: jasmine.createSpy('mapping0Validity')
      };

      $scope.form.mapping1 = {
        $setValidity: jasmine.createSpy('mapping1Validity')
      };

      $scope.form.mapping2 = {
        $setValidity: jasmine.createSpy('mapping2Validity')
      };

      $scope.resource.mediaMap.push({
        lookup: 'duplicate'
      });

      $scope.resource.mediaMap.push({
        lookup: 'duplicate'
      });

      $scope.resource.mediaMap.push({
        lookup: 'Mapping 2'
      });

      isolateScope.$digest();
      expect($scope.form.mapping0.$setValidity).toHaveBeenCalledWith('mediaMapDuplicate', false);
      expect($scope.form.mapping1.$setValidity).toHaveBeenCalledWith('mediaMapDuplicate', false);
      expect($scope.form.mapping2.$setValidity).toHaveBeenCalledWith('mediaMapDuplicate', true);
    });
  });
});
