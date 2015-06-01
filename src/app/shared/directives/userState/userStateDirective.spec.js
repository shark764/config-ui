'use strict';

describe('userState directive', function(){
  var $scope,
    $compile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', function(_$compile_,_$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));

  it('should have the state defined in scope', inject(function() {
    var element = $compile('<div user-state state="userState"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().state).toEqual('userState');
  }));
  
  it('should have a stateClass of "not-ready" when the state is not one of the known states.', inject(function() {
    var element = $compile('<div user-state state="userState"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('not-ready fa-times-circle-o');
  }));
  
  it('should have a stateClass of "ready" when the state is READY', inject(function() {
    var element = $compile('<div user-state state="READY"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('ready fa-check-circle');
  }));
  
  it('should have a stateClass of "busy" when the state is BUSY', inject(function() {
    var element = $compile('<div user-state state="BUSY"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('busy fa-check-circle-o');
  }));
  
  it('should have a stateClass of "not-ready" when the state is NOT_READY', inject(function() {
    var element = $compile('<div user-state state="NOT_READY"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('not-ready fa-times-circle-o');
  }));
  
  it('should display the state in a span', inject(function() {
    var element = $compile('<div><div user-state state="somestate"></div></div>')($scope);
    $scope.$digest();
    expect(element.find('span').length).toEqual(1);
  }));
  
});
