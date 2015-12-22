'use strict';

describe('MediaMappings directive', function() {
  var $scope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.media.mock'));
  beforeEach(module('liveopsConfigPanel.tenant.mediaCollection.mock'));

  beforeEach(inject(['$rootScope', '$compile', 'mockMediaCollections',
    function($rootScope, $compile, mockMediaCollections) {
      $scope = $rootScope.$new();

      $scope.collection = mockMediaCollections[0];
      $scope.form = {
        mediaMap: {
          $setDirty: jasmine.createSpy('dirtySpy'),
          $setTouched: jasmine.createSpy('touchedSpy')
        }
      };

      element = $compile('<media-mappings collection="collection" form="form"></media-mappings>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));

  describe('addMapping function', function() {
    it('should exist', function() {
      expect(isolateScope.addMapping).toBeDefined();
      expect(isolateScope.addMapping).toEqual(jasmine.any(Function));
    });

    it('should add an empty object to the mediaMap array, if defined.', function() {
      $scope.collection.mediaMap = [{
        id: 'first'
      }];

      isolateScope.addMapping();

      expect($scope.collection.mediaMap.length).toBe(2);
      expect($scope.collection.mediaMap[1]).toBeDefined();
      expect($scope.collection.mediaMap[1]).toEqual({});
    });

    it('should create a mediaMap array with an empty object, if no mediaMap exists', function() {

      isolateScope.addMapping();
      expect($scope.collection.mediaMap).toBeDefined();
      expect($scope.collection.mediaMap).toEqual(jasmine.any(Array));
      expect($scope.collection.mediaMap.length).toBe(1);
      expect($scope.collection.mediaMap[0]).toEqual({});
    });
  });

  describe('removeMapping function', function() {
    it('should exist', function() {
      expect(isolateScope.removeMapping).toBeDefined();
      expect(isolateScope.removeMapping).toEqual(jasmine.any(Function));
    });

    it('should remove the custom form elements and set dirty', inject(function() {
      $scope.collection.mediaMap = [{
        id: 'uuid-value'
      }, {
        id: 'some other value'
      }];

      isolateScope.removeMapping(1);

      expect($scope.collection.mediaMap.length).toBe(1);
      expect($scope.form.mediaMap.$setDirty).toHaveBeenCalled();
    }));

    it('should remove the mediaMap property if no mappings are left', function() {
      $scope.collection.mediaMap = [{
        id: 'uuid-value'
      }];

      isolateScope.removeMapping(0);

      expect($scope.collection.mediaMap).toBeUndefined();
    });

    it('should remove the defaultMediaKey property if no mappings are left', function() {
      $scope.collection.mediaMap = [{
        id: 'uuid-value'
      }];

      isolateScope.removeMapping(0);

      expect($scope.collection.defaultMediaKey).toBeUndefined();
    });
  });

  describe('resetDefaultMediaKey function', function() {
    beforeEach(function() {
      $scope.form.defaultMediaKey = {
        $setDirty: jasmine.createSpy('dirtySpy'),
        $setTouched: jasmine.createSpy('touchedSpy')
      };
    });

    it('should exist', function() {
      expect(isolateScope.resetDefaultMediaKey).toBeDefined();
      expect(isolateScope.resetDefaultMediaKey).toEqual(jasmine.any(Function));
    });

    it('should set defaultMediaKey to null', function() {
      $scope.collection.defaultMediaKey = 'exists!';
      isolateScope.resetDefaultMediaKey();
      expect($scope.collection.defaultMediaKey).toBeNull();
    });

    it('should touch and dirty the defaultMediaKey field', function() {
      isolateScope.resetDefaultMediaKey();
      expect($scope.form.defaultMediaKey.$setDirty).toHaveBeenCalled();
      expect($scope.form.defaultMediaKey.$setTouched).toHaveBeenCalled();
    });
  });
});
