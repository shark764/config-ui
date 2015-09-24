'use strict';

/* global spyOn: false */

describe('autocomplete directive', function(){
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
      content : 'firstItem',
      extraProp: 'true'
    }, {
      content: 'secondItem'
    }, {
      content: 'secondItemAgain'
    }, {
      content: 'thirdItem'
    }];

    $scope.selectFunction = function(){};

    doDefaultCompile = function(){
      element = $compile('<autocomplete items="items" name-field="content" on-select="selectFunction()" is-required="required" placeholder="Type here" hover="hover"></autocomplete>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    };
  }]));

  it('should set item to empty string if there is no text', function() {
    doDefaultCompile();
    $scope.currentText = '';
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('');
  });

  it('should set item to empty string if there is only whitespace', function() {
    doDefaultCompile();
    $scope.currentText = '                 ';
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('');
  });

  it('should do nothing if selected item changes to an object', function() {
    doDefaultCompile();
    isolateScope.currentText = 'some text';
    $scope.selectedItem = {id : '5'};
    $scope.$digest();
    expect(isolateScope.currentText).toEqual('some text');
  });

  describe('currentText watch', function(){
    it('should a new string if currentText has no matches', function() {
      doDefaultCompile();
      isolateScope.currentText = 'something new';
      isolateScope.$digest();
      expect(isolateScope.currentText).toEqual('something new');
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
      element = $compile('<autocomplete items="items" name-field="content" selected-item="selected" is-required="required" placeholder="Type here" hover="hover"></autocomplete>')($scope);
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
    it('should set the current text/selection', function() {
      doDefaultCompile();

      isolateScope.select({content : 'new item'});
      expect(isolateScope.currentText).toEqual('new item');
    });

    it('should clear hovering', function() {
      doDefaultCompile();

      isolateScope.select({content : 'new item'});
      expect(isolateScope.hovering).toEqual(false);
    });
  });
});
