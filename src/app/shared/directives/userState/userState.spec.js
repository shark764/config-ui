'use strict';

describe('userState directive', function(){
  var $scope,
    $compile;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(function(_$compile_,_$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  it('should show the state', inject(function() {
    var element = $compile('<div><div user-state state="some state"></div></div>')($scope);
    $scope.$digest();
    expect(element.html()).toContain('some state</span>');
  }));
});
