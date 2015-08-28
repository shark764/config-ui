'use strict';

describe('loMultibox directive', function(){
  var $scope,
    element,
    isolateScope,
    $rootScope;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$q', function($compile, _$rootScope_, $q) {
    $scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;

    $scope.items = [{
      displayname: 'the first',
      id: '123',
      otherprop: 'Red',
      getDisplay: jasmine.createSpy('getDisplay')
    }, {
      displayname: 'second',
      id: '456',
      otherprop: 'Blue',
      getDisplay: jasmine.createSpy('getDisplay')
    }, {
      displayname: '3',
      id: '789',
      otherprop: 'Yellow',
      getDisplay: jasmine.createSpy('getDisplay')
    }];
    
    $scope.model = {importantprop: 'important value'};

    element = $compile('<lo-multibox items="items" model="model" resource-name="myresource" name="myinput" display-field="displayname"></lo-multibox>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should add a typeahead field', inject(function() {
    expect(element.find('type-ahead').length).toEqual(1);
  }));

  it('should catch create event and select the created resource, if in create mode', inject([function () {
    var newItem =  {
      displayname: 'fourth',
      id: 'new',
      otherprop: 'Aqua'
    };

    isolateScope.createMode = true;
    spyOn(isolateScope, 'onSelect');

    $rootScope.$broadcast('resource:details:myresource:create:success', newItem);

    isolateScope.$digest();
    expect(isolateScope.onSelect).toHaveBeenCalledWith(newItem);
  }]));

  it('should catch create event but do nothing if not in create mode', function () {
    isolateScope.createMode = false;
    spyOn(isolateScope, 'onSelect');
    $rootScope.$broadcast('resource:details:myresource:create:success', {});
    isolateScope.$digest();
    expect(isolateScope.onSelect).not.toHaveBeenCalled();
  });

  it('should catch cancel event and disable create mode', function () {
    isolateScope.createMode = true;
    $rootScope.$broadcast('resource:details:myresource:canceled', {});
    isolateScope.$digest();
    expect(isolateScope.createMode).toBeFalsy();
  });

  describe('onSelect function', function () {
    it('should copy selected id into model but leave other properties untouched', function () {
      isolateScope.onSelect({
        id: '1234',
        otherprop: 'NO',
        getDisplay: jasmine.createSpy('getDisplay')
      });

      expect($scope.model.id).toEqual('1234');
      expect($scope.model.otherprop).toBeUndefined();
      expect($scope.model.importantprop).toEqual('important value');
    });

    it('should disable edit and showDrop modes', inject(function () {
      isolateScope.showDrop = true;
      isolateScope.createMode = true;

      isolateScope.onSelect({
        getDisplay: jasmine.createSpy('getDisplay'),
        id: '1234'
      });
      $scope.$digest();

      expect(isolateScope.showDrop).toBeFalsy();
      expect(isolateScope.createMode).toBeFalsy();
    }));
  });

  describe('createItem function', function () {
    it('should exist', function () {
      expect(isolateScope.createItem).toBeDefined();
      expect(isolateScope.createItem).toEqual(jasmine.any(Function));
    });

    it('should emit the create event', inject(function () {
      spyOn(isolateScope, '$emit');
      isolateScope.createItem();
      expect(isolateScope.$emit).toHaveBeenCalledWith('resource:details:create:myresource',
        jasmine.any(Object));
    }));
  });

  describe('labelClick function', function () {
    it('should exist', function () {
      expect(isolateScope.labelClick).toBeDefined();
      expect(isolateScope.labelClick).toEqual(jasmine.any(Function));
    });

    it('should toggle showDrop', inject(function () {
      isolateScope.showDrop = true;
      isolateScope.labelClick();
      expect(isolateScope.showDrop).toBeFalsy();

      isolateScope.labelClick();
      expect(isolateScope.showDrop).toBeTruthy();
    }));

    it('should reset the selected item', inject(function () {
      isolateScope.selectedItem = {prop: 'value'};
      isolateScope.labelClick();
      expect(isolateScope.selectedItem).toBeNull();
    }));
  });
});