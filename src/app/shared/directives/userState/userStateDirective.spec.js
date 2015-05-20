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
  
  it('should have a stateClass of "not-ready" when the state is not online, offline or busy.', inject(function() {
    var element = $compile('<div user-state state="userState"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('not-ready');
  }));
  
  it('should have a stateClass of "ready" when the state is online', inject(function() {
    var element = $compile('<div user-state state="online"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('ready');
  }));
  
  it('should have a stateClass of "busy" when the state is busy', inject(function() {
    var element = $compile('<div user-state state="busy"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('busy');
  }));
  
  it('should have a stateClass of "not-ready" when the state is offline', inject(function() {
    var element = $compile('<div user-state state="offline"></div>')($scope);
    $scope.$digest();
    expect(element.isolateScope().stateClass).toEqual('not-ready');
  }));
  
  it('should display the state in a span', inject(function() {
    var element = $compile('<div><div user-state state="somestate"></div></div>')($scope);
    $scope.$digest();
    expect(element.find('span').length).toEqual(1);
  }));
  
});
