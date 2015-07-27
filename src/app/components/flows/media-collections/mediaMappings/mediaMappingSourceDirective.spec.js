'use strict';

describe('MediaMappingsSource directive', function () {
  var $scope,
    $rootScope,
    element,
    isolateScope;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));
  beforeEach(module('liveopsConfigPanel.mock.content.flows.media.mediaController'));

  beforeEach(inject(['$rootScope', '$compile', 'medias',
    function (_$rootScope_, $compile, medias) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      
      $scope.medias = medias;
      $scope.mapping = {};
      $scope.onDirty = jasmine.createSpy('onDirty');
      
      element = $compile('<media-mapping-source mapping="mapping" medias="medias" on-dirty="onDirty()"></media-mapping-source>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }
  ]));
  
  it('should catch media create event and select the created resource, if in edit mode', inject(['Media', function (Media) {
    var newMedia = new Media({id: 'new'});
    isolateScope.editMode = true;
    spyOn(isolateScope, 'onSelect');
    
    $rootScope.$broadcast('resource:details:media:create:success', newMedia);
    
    isolateScope.$digest();
    expect(isolateScope.onSelect).toHaveBeenCalled();
  }]));
  
  it('should catch media create event but do nothing if not in edit mode', function () {
    isolateScope.editMode = false;
    spyOn(isolateScope, 'onSelect');
    $rootScope.$broadcast('resource:details:media:create:success', {});
    isolateScope.$digest();
    expect(isolateScope.onSelect).not.toHaveBeenCalled();
  });
  
  describe('onSelect function', function () {
    it('should copy selected name and id into mapping', function () {
      isolateScope.onSelect({
        name: 'Some name',
        id: '1234'
      });
      
      expect($scope.mapping.name).toEqual('Some name');
      expect($scope.mapping.id).toEqual('1234');
    });

    it('should call the onDirty function', inject(function () {
      isolateScope.onSelect({
        name: 'Some name',
        id: '1234'
      });
      
      expect($scope.onDirty).toHaveBeenCalled();
    }));

    it('should disable edit mode', inject(function () {
      isolateScope.editMode = true;
      
      isolateScope.onSelect({
        name: 'Some name',
        id: '1234'
      });
      
      expect(isolateScope.editMode).toBeFalsy();
    }));
  });

  describe('createMapping function', function () {
    it('should exist', function () {
      expect(isolateScope.createMapping).toBeDefined();
      expect(isolateScope.createMapping).toEqual(jasmine.any(Function));
    });

    it('should emit the createMapping event', inject(function () {
      spyOn(isolateScope, '$emit');
      isolateScope.createMapping();
      expect(isolateScope.$emit).toHaveBeenCalledWith('resource:details:create:mediaMapping', jasmine.any(Object));
    }));
  });
});