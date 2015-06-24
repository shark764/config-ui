'use strict';

/*global jasmine, spyOn: false */

describe('tableControls directive', function() {
  var $scope,
    $compile,
    $rootScope,
    $stateParams,
    $templateCache,
    $location,
    element,
    isolateScope,
    doCompile;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$stateParams', '$location', '$templateCache',
    function(_$compile_, _$rootScope_, _$stateParams_, _$location_, _$templateCache_) {
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $stateParams = _$stateParams_;
    $location = _$location_;
    $templateCache = _$templateCache_;

    $scope.config = {fields : [{name: 'id'}], searchOn: ['id']};
    $scope.selected = {};
    $scope.resourceName = 'resource';
    $scope.extendScope = {};
    $scope.id = 'my-table';
    $scope.items = [];
    $scope.items.$promise = {
        then : function(callback){
          callback();
        }
    };
    
    doCompile = function(){
      element = $compile('<table-controls items="items" config="config" selected="selected" resource-name="{{resourceName}}" extend-scope="extendScope" id="id"></table-controls>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));

  it('should create a table', inject(function() {
    doCompile();
    expect(element.find('table').length).toEqual(1);
  }));
  
  it('should add extendscope to its own scope', inject(function() {
    $scope.extendScope = {'newProperty' : 'neat'};
    doCompile();
    expect(isolateScope.newProperty).toBeDefined();
    expect(isolateScope.newProperty).toEqual('neat');
  }));
  
  it('should select item based on url param', inject(function() {
    $scope.items.push({id: 'item1'});
    $scope.items.push({id: 'item2'});
    $stateParams.id = 'item2';
    doCompile();
    expect($scope.selected).toEqual($scope.items[1]);
  }));
  
  it('should select the first item on init if there is no id param', inject(function() {
    delete $stateParams.id;
    $scope.selected = null;
    $scope.items.push({id: 'item1'});
    $scope.items.push({id: 'item2'});
    doCompile();
    expect($scope.selected).toEqual($scope.items[0]);
  }));
  
  it('should include template for columns that define it', inject(function() {
    $templateCache.put('candyTemplate.html', '<candy>{{item.favCandy}}</candy>');
    $scope.config.fields.push({
        name: 'favCandy',
        templateUrl: 'candyTemplate.html'
    });
    $scope.items.push({id: 'item1', favCandy: 'Wurthers'});
    $scope.items.push({id: 'item2', favCandy: 'Peppermint'});
    
    doCompile();
    expect(element.find('candy').length).toBe(2);
  }));
  
  describe('selectItem function', function(){
    beforeEach(function(){
      doCompile();
    });
    
    it('should be defined', inject(function() {
      expect(isolateScope.selectItem).toBeDefined();
      expect(isolateScope.selectItem).toEqual(jasmine.any(Function));
    }));
    
    it('should set selected', inject(function() {
      isolateScope.selectItem({name: 'my new item'});
      $scope.$digest();
      expect($scope.selected.name).toEqual('my new item');
    }));
    
    it('should call location to update the query param', inject(function() {
      spyOn($location, 'search');
      isolateScope.selectItem({id: 'id1'});
      expect($location.search).toHaveBeenCalledWith({id : 'id1'});
      
      $location.search.calls.reset();
      isolateScope.selectItem({});
      expect($location.search).toHaveBeenCalledWith({id : undefined});
    }));
    
    it('should emit the resource:selected event', inject(function() {
      spyOn(isolateScope, '$emit');
      isolateScope.selectItem({name: 'my item'});
      expect(isolateScope.$emit).toHaveBeenCalledWith('resource:selected', {name: 'my item'});
    }));
  });
  
  describe('onCreateClick function', function(){
    beforeEach(function(){
      doCompile();
    });
    
    it('should emit the on:click:create event', inject(function() {
      spyOn(isolateScope, '$emit');
      isolateScope.onCreateClick();
      expect(isolateScope.$emit).toHaveBeenCalledWith('on:click:create');
    }));
  });
  
  describe('toggleAll function', function(){
    beforeEach(function(){
      $scope.items.push({id: 'item1', checked: false});
      $scope.items.push({id: 'item2', checked: true});
      $scope.items.push({id: 'item3'});
      doCompile();
    });
    
    it('should set all filtered items to checked when param is true', inject(function() {
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeTruthy();
    }));
    
    it('should set all filtered items to unchecked when param is false', inject(function() {
      isolateScope.toggleAll(false);
      expect($scope.items[0].checked).toBeFalsy();
      expect($scope.items[1].checked).toBeFalsy();
      expect($scope.items[2].checked).toBeFalsy();
     }));
    
    it('should only apply to filtered items', inject(function() {
      isolateScope.filtered.removeItem($scope.items[2]);
      isolateScope.toggleAll(true);
      expect($scope.items[0].checked).toBeTruthy();
      expect($scope.items[1].checked).toBeTruthy();
      expect($scope.items[2].checked).toBeFalsy();
     }));
  });
  
  describe('filtered watch', function(){
    beforeEach(function(){
      $scope.items.push({id: 'item1', checked: false});
      $scope.items.push({id: 'item2', checked: true});
      $scope.items.push({id: 'item3'});
      doCompile();
    });
    
    it('should set selected item null if filtered is empty', inject(function() {
      spyOn(isolateScope, 'selectItem');
      isolateScope.searchQuery = 'a search';
      isolateScope.$digest();
      expect(isolateScope.selectItem).toHaveBeenCalledWith(null);
    }));
    
    it('should set selected item if there isn\'t one', inject(function() {
      spyOn(isolateScope, 'selectItem');
      delete isolateScope.selected;
      isolateScope.searchQuery = 'item1';
      isolateScope.$digest();
      expect(isolateScope.selectItem).toHaveBeenCalledWith($scope.items[0]);
    }));
    
    it('should reset selected item if old one gets filtered', inject(function() {
      spyOn(isolateScope, 'selectItem');
      isolateScope.selected = $scope.items[2];
      isolateScope.searchQuery = 'item1';
      isolateScope.$digest();
      expect(isolateScope.selectItem).toHaveBeenCalledWith($scope.items[0]);
    }));
    
    it('should uncheck items that have been filtered out', inject(function() {
      isolateScope.searchQuery = 'item3';
      isolateScope.$digest();
      expect($scope.items[1].checked).toBeFalsy();
    }));
  });
  
  describe('resourceName watch', function(){
    beforeEach(function(){
      doCompile();
    });
    
    it('should define resourceWatcher function returned from scope.$on', inject(function() {
      isolateScope.resourceName = 'anotherName';
      isolateScope.$digest();
      expect(isolateScope.resourceWatcher).toBeDefined();
    }));
    
    it('should call resourceWatcher function to remove old watcher', inject(function() {
      var removeSpy = spyOn(isolateScope, 'resourceWatcher');
      isolateScope.resourceName = 'anotherName';
      isolateScope.$digest();
      expect(removeSpy).toHaveBeenCalled();
    }));
    
    it('should catch the created event and add new item to items', inject(function() {
      $rootScope.$broadcast('created:resource:resource', {id: 'coolItem'});
      isolateScope.$digest();
      expect($scope.items.length).toEqual(1);
      expect($scope.items[0].id).toEqual('coolItem');
    }));
  });
  
  describe('parse function', function(){
    beforeEach(function(){
      doCompile();
    });
    
    it('should define resourceWatcher function returned from scope.$on', inject(function() {
      isolateScope.resourceName = 'anotherName';
      isolateScope.$digest();
      expect(isolateScope.resourceWatcher).toBeDefined();
    }));
    
    it('should call resourceWatcher function to remove old watcher', inject(function() {
      var removeSpy = spyOn(isolateScope, 'resourceWatcher');
      isolateScope.resourceName = 'anotherName';
      isolateScope.$digest();
      expect(removeSpy).toHaveBeenCalled();
    }));
    
    it('should catch the created event and add new item to items', inject(function() {
      $rootScope.$broadcast('created:resource:resource', {id: 'coolItem'});
      isolateScope.$digest();
      expect($scope.items.length).toEqual(1);
      expect($scope.items[0].id).toEqual('coolItem');
    }));
  });
});
