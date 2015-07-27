'use strict';

/* global spyOn: false */
describe('MediaMappings directive', function () {
  var $scope,
    $httpBackend,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows.media.mediaController'));
  beforeEach(module('liveopsConfigPanel.mock.content.media.collections'));

  beforeEach(inject(['$rootScope', '$compile', 'mockMediaCollections',
    function ($rootScope, $compile, mockMediaCollections) {
      $scope = $rootScope.$new();

      $scope.collection = mockMediaCollections[0];
      $scope.form = {
        mediaMapChanges: {
          $setDirty: jasmine.createSpy('dirtySpy')
        }
      };
      
      element = $compile('<media-mappings collection="collection" form="form"></media-mappings>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));
  
  describe('addMapping function', function () {
    it('should exist', function () {
      expect(isolateScope.addMapping).toBeDefined();
      expect(isolateScope.addMapping).toEqual(jasmine.any(Function));
    });

    it('should add an empty object to the mediaMap array, if defined.', inject(function () {
      $scope.collection.mediaMap = [{id: 'first'}];
      
      isolateScope.addMapping();
      
      expect($scope.collection.mediaMap.length).toBe(2);
      expect($scope.collection.mediaMap[1]).toBeDefined();
      expect($scope.collection.mediaMap[1]).toEqual({});
    }));

    it('should create a mediaMap array with an empty object, if no mediaMap exists', inject(function () {

      isolateScope.addMapping();
      expect($scope.collection.mediaMap).toBeDefined();
      expect($scope.collection.mediaMap).toEqual(jasmine.any(Array));
      expect($scope.collection.mediaMap.length).toBe(1);
      expect($scope.collection.mediaMap[0]).toEqual({});
    }));
  });

  describe('removeMapping function', function () {
    it('should exist', function () {
      expect(isolateScope.removeMapping).toBeDefined();
      expect(isolateScope.removeMapping).toEqual(jasmine.any(Function));
    });

    it('should remove the custom form elements and set dirty', inject(function () {
      $scope.collection.mediaMap = [{
        id: 'uuid-value'
      }, {
        id: 'some other value'
      }];

      isolateScope.removeMapping(1);

      expect($scope.collection.mediaMap.length).toBe(1);
      expect($scope.form.mediaMapChanges.$setDirty).toHaveBeenCalled();
    }));

    it('should remove the mediaMap property if no mappings are left', inject(function () {
      $scope.collection.mediaMap = [{
        id: 'uuid-value'
      }];

      var form = {
        mediaMapChanges: {
          $setDirty: jasmine.createSpy('dirtySpy')
        }
      };

      isolateScope.removeMapping(0);

      expect($scope.collection.mediaMap).toBeUndefined();
    }));
  });
});