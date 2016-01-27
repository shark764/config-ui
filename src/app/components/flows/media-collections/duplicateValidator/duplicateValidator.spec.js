'use strict';

describe('duplicateValidator directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('liveopsConfigPanel', 'gulpAngular', 'liveopsConfigPanel.mockutils'));

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
    it('should set the validity on all mediaMap form elements', inject(function(mockForm) {
      isolateScope.form = mockForm(['mapping0', 'mapping1']);

      $scope.resource.mediaMap.push({
        lookup: 'Mapping 0'
      });

      $scope.resource.mediaMap.push({
        lookup: 'Mapping 1'
      });

      isolateScope.$digest();
      expect(isolateScope.form.mapping0.$setValidity).toHaveBeenCalled();
      expect(isolateScope.form.mapping1.$setValidity).toHaveBeenCalled();
    }));

    it('should set duplicate named mappings invalid', inject(function(mockForm) {
      isolateScope.form = mockForm(['mapping0', 'mapping1', 'mapping2']);

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
      expect(isolateScope.form.mapping0.$setValidity).toHaveBeenCalledWith('mediaMapDuplicate', false);
      expect(isolateScope.form.mapping1.$setValidity).toHaveBeenCalledWith('mediaMapDuplicate', false);
      expect(isolateScope.form.mapping2.$setValidity).toHaveBeenCalledWith('mediaMapDuplicate', true);
    }));
  });
});
