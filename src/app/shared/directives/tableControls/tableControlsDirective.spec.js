'use strict';

/*global jasmine, spyOn: false */

describe('tableControls directive', function() {
  var $scope,
    $stateParams,
    element,
    isolateScope,
    doCompile,
    $location,
    loEvents;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$stateParams', 'loEvents', '$location',
    function($compile, $rootScope, _$stateParams, _loEvents, _$location) {
      $scope = $rootScope.$new();
      $stateParams = _$stateParams;
      loEvents = _loEvents;
      $location = _$location;

      $scope.config = {
        fields: [{
          name: 'id'
        }]
      };

      $scope.items = [];
      $scope.items.$promise = {
        then: function(callback) {
          callback();
        }
      };
      $scope.items.$resolved = true;

      doCompile = function() {
        element = $compile('<table-controls items="items" config="config"></table-controls>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
      };
    }
  ]));

  describe('onCreateClick function', function() {
    beforeEach(function() {
      doCompile();
    });

    it('should be defined', function() {
      expect(isolateScope.onCreateClick).toBeDefined();
      expect(isolateScope.onCreateClick).toEqual(jasmine.any(Function));
    });

    it('should check DirtyForms.confirmIfDirty', inject(function(DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.onCreateClick();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }));

    it('should emit the table create click event', inject(function($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.onCreateClick();
      expect($rootScope.$broadcast).toHaveBeenCalledWith(loEvents.tableControls.itemCreate);
    }));
  });

  describe('onActionsClick function', function() {
    beforeEach(function() {
      doCompile();
    });

    it('should be defined', function() {
      expect(isolateScope.onActionsClick).toBeDefined();
      expect(isolateScope.onActionsClick).toEqual(jasmine.any(Function));
    });

    it('should check DirtyForms.confirmIfDirty', inject(function(DirtyForms) {
      spyOn(DirtyForms, 'confirmIfDirty');
      isolateScope.onActionsClick();
      expect(DirtyForms.confirmIfDirty).toHaveBeenCalled();
    }));

    it('should emit the table actions click event', inject(function($rootScope) {
      spyOn($rootScope, '$broadcast');
      isolateScope.onActionsClick();
      expect($rootScope.$broadcast).toHaveBeenCalledWith(loEvents.tableControls.actions);
    }));
  });
});
