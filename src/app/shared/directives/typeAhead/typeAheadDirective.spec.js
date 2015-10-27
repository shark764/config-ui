'use strict';

/* global spyOn, jQuery: false */

describe('typeAhead directive', function(){
  var $scope,
    $compile,
    element,
    isolateScope,
    doDefaultCompile,
    $timeout;

  beforeEach(module('gulpAngular'));
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('liveopsConfigPanel.mock.content'));

  beforeEach(inject(['$compile', '$rootScope', '$timeout', function(_$compile_, $rootScope, _$timeout_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $timeout = _$timeout_;
    
    $scope.items = [{
      title : 'firstItem', 
      extraProp: 'true',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('firstItem')
    }, {
      title: 'secondItem',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('secondItem')
    }, {
      title: 'secondItemAgain',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('secondItemAgain')
    }, {
      title: 'thirdItem',
      getDisplay: jasmine.createSpy('getDisplay').and.returnValue('thirdItem')
    }];
    
    $scope.selectedItem = {id: '2'};
    $scope.selectFunction = function(){};
    
    doDefaultCompile = function(){
      element = $compile('<type-ahead items="items" name-field="title" ' +
        'selected-item="selected" on-select="selectFunction()" is-required="required" ' +
        'placeholder="Type here" hover="hover"></type-ahead>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));
  
  it('should set text to empty if the selected item changes to null', function() {
    doDefaultCompile();
    $scope.selectedItem = null;
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('');
  });
  
  it('should set item to null if there is no text', function() {
    doDefaultCompile();
    $scope.currentText = '';
    $scope.$digest();
    expect(isolateScope.selectedItem).toBeNull();
  });
  
  it('should set item to null if there is only whitespace', function() {
    doDefaultCompile();
    $scope.currentText = '                 ';
    $scope.$digest();
    expect(isolateScope.selectedItem).toBeNull();
  });
  
  it('should do nothing if selected item changes to an object', function() {
    doDefaultCompile();
    isolateScope.currentText = 'some text';
    $scope.selectedItem = {id : '5'};
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('some text');
  });
  
  describe('currentText watch', function(){
    it('should set selectedItem to the search string if currentText has no matches', function() {
      doDefaultCompile();
      isolateScope.currentText = 'typing some stuff';
      isolateScope.$digest();
      expect(isolateScope.selectedItem).toEqual('typing some stuff');
    });
    
    it('should set selectedItem to the first exact matching item', function() {
      doDefaultCompile();
      isolateScope.currentText = 'firstItem';
      isolateScope.$digest();
      expect(angular.equals(isolateScope.selectedItem, {title : 'firstItem', extraProp: 'true'})).toBeTruthy();
    });
  });
  
  describe('select function', function(){
    it('should set the selected item', function() {
      doDefaultCompile();
      
      isolateScope.select({title : 'new item'});
      expect(isolateScope.selectedItem).toEqual({title : 'new item'});
    });
    
    it('should clear hovering', function() {
      doDefaultCompile();
      
      isolateScope.select({title : 'new item'});
      expect(isolateScope.hovering).toEqual(false);
    });
    
    it('should set the current text to the proper field value is getDisplay is not defined on the selected item', function() {
      doDefaultCompile();
      
      isolateScope.select({title : 'new item', anotherProp : 'Blah'});
      expect(isolateScope.currentText).toEqual('new item');
    });
  });
  
  describe('ON filters watch', function() {
    var controller;
    
    describe('WHEN filters, nameField not supplied', function() {
      beforeEach(function() {
        element = $compile('<type-ahead items="items" ' +
          'selected-item="selected"></type-ahead>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        
        controller = element.data('$typeAheadController');
      });
      
      it('should have only the defaultTextFilter in fitlerArray WHEN no filters or nameField are given', function() {
        expect(isolateScope.filterArray).toBeDefined();
        expect(isolateScope.filterArray.length).toEqual(1);
        
        expect(isolateScope.filterArray[0]).toBe(controller.defaultTextFilter);
      });
    });
    
    describe('WHEN filters supplied and is a function', function() {
      var func1 = function() {
        return;
      };
      
      beforeEach(function() {
        $scope.filters = func1;
      });

      it('should create array with $scope.filters and defaultTextFilter in fitlerArray', function() {
        element = $compile('<type-ahead items="items" ' +
          'selected-item="selected" filters="filters"></type-ahead>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        
        controller = element.data('$typeAheadController');
        
        expect(isolateScope.filterArray).toBeDefined();
        expect(isolateScope.filterArray.length).toEqual(2);
        
        expect(isolateScope.filterArray.indexOf(func1)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.defaultTextFilter)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.nameFieldTextFilter)).toEqual(-1);
      });
    });
    
    describe('WHEN filters is supplied is and array', function() {
      var func1 = function() {
        return;
      };
      
      var func2 = function() {
        return;
      };
      
      beforeEach(function() {
        $scope.filters = [func1, func2];
      });

      it('should create array with $scope.filters merged with defaultTextFilter in fitlerArray', function() {
        element = $compile('<type-ahead items="items" ' +
          'selected-item="selected" filters="filters"></type-ahead>')($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        
        controller = element.data('$typeAheadController');
        
        expect(isolateScope.filterArray).toBeDefined();
        expect(isolateScope.filterArray.length).toEqual(3);
        
        expect(isolateScope.filterArray.indexOf(func1)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(func2)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.defaultTextFilter)).not.toEqual(-1);
        expect(isolateScope.filterArray.indexOf(controller.nameFieldTextFilter)).toEqual(-1);
      });
    });
  });
  
  describe('keypress event handler', function(){
    it('should call select with highlightedItem on pressing the enter key', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      var highlightedItem = {id: 'highlight'};
      isolateScope.highlightedItem = highlightedItem;
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.select).toHaveBeenCalledWith(highlightedItem);
    }));
    
    it('should call select with currenttext on pressing the enter key if nothing is highlighted', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      isolateScope.currentText = 'some text';
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.select).toHaveBeenCalledWith('some text');
    }));
    
    it('should call onEnter with the highlighted item on pressing the enter key', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      spyOn(isolateScope, 'onEnter');
      var highlightedItem = {id: 'highlight'};
      isolateScope.highlightedItem = highlightedItem;
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.onEnter).toHaveBeenCalledWith({item: highlightedItem});
    }));
    
    it('should call onEnter with the current text on pressing the enter key if nothing is selected', inject(function($timeout) {
      doDefaultCompile();
      
      spyOn(isolateScope, 'select');
      spyOn(isolateScope, 'onEnter');
      isolateScope.currentText = 'some text';
      
      var event = jQuery.Event('keydown');
      event.which = 13;
      element.find('input').trigger(event);
      $timeout.flush();
      expect(isolateScope.onEnter).toHaveBeenCalledWith({item: 'some text'});
    }));
    
    it('should highlight the next item on down arrow key, if there are more items', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[0];
      
      var event = jQuery.Event('keydown');
      event.which = 40;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[1]);
    }));
    
    it('should do nothing on down arrow if the current highlight is the last', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[3];
      
      var event = jQuery.Event('keydown');
      event.which = 40;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[3]);
    }));
    
    it('should highlight the previous item on up arrow key, if there are any', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[3];
      
      var event = jQuery.Event('keydown');
      event.which = 38;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[2]);
    }));
    
    it('should do nothing on up arrow if the current highlight is the first', inject(function($timeout) {
      doDefaultCompile();
      
      isolateScope.highlightedItem = $scope.items[0];
      
      var event = jQuery.Event('keydown');
      event.which = 38;
      element.find('input').trigger(event);
      
      $timeout.flush();
      expect(isolateScope.highlightedItem).toEqual($scope.items[0]);
    }));
  });
  
  describe('onBlur function', function(){
    it('should set showSuggestions to false', inject(function() {
      doDefaultCompile();
      
      isolateScope.showSuggestions = true;
      isolateScope.keepExpanded = false;
      
      isolateScope.onBlur();
      
      expect(isolateScope.showSuggestions).toBeFalsy();
    }));
    
    it('should do nothing if keeyExpanded is true', inject(function() {
      doDefaultCompile();
      
      isolateScope.showSuggestions = true;
      isolateScope.keepExpanded = true;
      
      isolateScope.onBlur();
      
      expect(isolateScope.showSuggestions).toBeTruthy();
    }));
  });
});