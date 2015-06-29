'use strict';

/* global spyOn: false */

describe('highlightOnClick directive', function(){
  var $scope,
    $window,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$window', function($compile, _$rootScope_, _$window_) {
    $scope = _$rootScope_.$new();
    $window = _$window_;
    
    $scope.myInput = 'hello, world';
    element = $compile('<input ng-model="myInput" highlight-on-click></input>')($scope);
    $scope.$digest();
  }]));

  //TODO: Haven't figured out how to read the selected text to verify that it's being set correctly
  
  it('should check window.getselection', inject(function() {
    spyOn($window, 'getSelection').and.callThrough();
    element.triggerHandler('click');
    expect($window.getSelection).toHaveBeenCalled();
  }));
  
  it('should do nothing if the window has something selected', inject(function() {
    spyOn($window, 'getSelection').and.callFake(function(){
      return 'A prior selection';
    });
    element.triggerHandler('click');
    expect($window.getSelection()).toEqual('A prior selection'); //TODO: This may not be the actual way to verify selected text?
  }));
});
