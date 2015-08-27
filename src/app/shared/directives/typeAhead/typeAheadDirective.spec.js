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
      element = $compile('<type-ahead items="items" name-field="title" selected-item="selected" on-select="selectFunction()" is-required="required" placeholder="Type here" hover="hover"></type-ahead>')($scope);
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
    it('should prepare a new object if currentText has no matches', function() {
      doDefaultCompile();
      isolateScope.currentText = 'typing some stuff';
      isolateScope.$digest();
      expect(isolateScope.selectedItem).toEqual({title : 'typing some stuff'});
    });
    
    it('should set selectedItem to the first exact matching item', function() {
      doDefaultCompile();
      isolateScope.currentText = 'firstItem';
      isolateScope.$digest();
      expect(angular.equals(isolateScope.selectedItem, {title : 'firstItem', extraProp: 'true'})).toBeTruthy();
    });
    
    it('should call onSelect if given', function() {
      doDefaultCompile();
      
      spyOn($scope, 'selectFunction');
      isolateScope.currentText = 'firstItem';
      isolateScope.$digest();
      $timeout.flush();
      
      expect($scope.selectFunction).toHaveBeenCalled();
    });
    
    it('should not call onSelect if not given', function() {
      element = $compile('<type-ahead items="items" name-field="title" selected-item="selected" is-required="required" placeholder="Type here" hover="hover"></type-ahead>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
      
      spyOn($scope, 'selectFunction');
      isolateScope.currentText = 'firstItem';
      isolateScope.$digest();
      expect($scope.selectFunction).not.toHaveBeenCalled();
    });
    
    it('should not call onSelect if no match', function() {
      doDefaultCompile();
      
      spyOn($scope, 'selectFunction');
      isolateScope.currentText = 'A weird entry';
      isolateScope.$digest();
      expect($scope.selectFunction).not.toHaveBeenCalled();
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
    
    it('should set the current text to the proper field value', function() {
      doDefaultCompile();
      
      isolateScope.select({title : 'new item', anotherProp : 'Blah'});
      expect(isolateScope.currentText).toEqual('new item');
    });
  });
});