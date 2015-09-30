'use strict';

/* global spyOn: false */

describe('typeAhead directive', function(){
  var $scope,
    $compile,
    element,
    isolateScope,
    doDefaultCompile,
    $timeout;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));
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
    
//    describe('WHEN nameField supplied filters not supplied', function() {
//      beforeEach(function() {
//        element = $compile('<type-ahead items="items" name-field="title" ' +
//          'selected-item="selected"></type-ahead>')($scope);
//        $scope.$digest();
//        isolateScope = element.isolateScope();
//        
//        controller = element.data('$typeAheadController');
//        
//      });
//      
//      it('should have only the nameFieldTextFilter in fitlerArray', function() {
//        expect(isolateScope.filterArray).toBeDefined();
//        expect(isolateScope.filterArray.length).toEqual(1);
//        
//        expect(isolateScope.filterArray[0]).toBe(controller.nameFieldTextFilter);
//      });
//    });
    
    describe('WHEN filters supplied and is a function', function() {
      var func1 = function() {
        return;
      };
      
      beforeEach(function() {
        $scope.filters = func1;
      });
      
//      describe('WHEN nameField is supplied', function() {
//        it('should create array with $scope.filters and nameFieldTextFilter in fitlerArray', function() {
//          element = $compile('<type-ahead items="items" name-field="title" ' +
//            'selected-item="selected" filters="filters"></type-ahead>')($scope);
//          $scope.$digest();
//          isolateScope = element.isolateScope();
//          
//          controller = element.data('$typeAheadController');
//          
//          expect(isolateScope.filterArray).toBeDefined();
//          expect(isolateScope.filterArray.length).toEqual(2);
//          
//          expect(isolateScope.filterArray.indexOf(func1)).not.toEqual(-1);
//          expect(isolateScope.filterArray.indexOf(controller.defaultTextFilter)).toEqual(-1);
//          expect(isolateScope.filterArray.indexOf(controller.nameFieldTextFilter)).not.toEqual(-1);
//        });
//      });
//      
//      describe('WHEN nameField is not supplied', function() {
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
//      });
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
      
//      describe('WHEN nameField is supplied', function() {
//        it('should create array with $scope.filters merged with nameFieldTextFilter in fitlerArray', function() {
//          element = $compile('<type-ahead items="items" name-field="title" ' +
//            'selected-item="selected" filters="filters"></type-ahead>')($scope);
//          $scope.$digest();
//          isolateScope = element.isolateScope();
//          
//          controller = element.data('$typeAheadController');
//          
//          expect(isolateScope.filterArray).toBeDefined();
//          expect(isolateScope.filterArray.length).toEqual(3);
//          
//          expect(isolateScope.filterArray.indexOf(func1)).not.toEqual(-1);
//          expect(isolateScope.filterArray.indexOf(func2)).not.toEqual(-1);
//          expect(isolateScope.filterArray.indexOf(controller.defaultTextFilter)).toEqual(-1);
//          expect(isolateScope.filterArray.indexOf(controller.nameFieldTextFilter)).not.toEqual(-1);
//        });
//      });
      
      //describe('WHEN nameField is not supplied', function() {
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
      //});
    });
  });
});