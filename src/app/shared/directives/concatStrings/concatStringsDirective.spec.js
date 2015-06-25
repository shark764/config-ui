'use strict';

describe('concatStrings directive', function(){
  var $scope,
    $compile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_,_$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }]));

  it('should create an empty string for an empty model array', inject(function() {
    $scope.models = [];
    
    var element = $compile('<concat-strings models="models" field="name" seperator=","></concat-strings>')($scope);
    $scope.$digest();
    expect(element.isolateScope().identifiers).toEqual('');
  }));
  
  it('should join the model strings with seperator and space', inject(function() {
    $scope.models = [{name: 'matt'}, {name: 'mark'}, {name: 'luke'}];
    
    var element = $compile('<concat-strings models="models" field="name" seperator=","></concat-strings>')($scope);
    $scope.$digest();
    expect(element.isolateScope().identifiers).toEqual('matt, mark, luke');
  }));
  
  it('should join with space if no seperator given', inject(function() {
    $scope.models = [{name: 'matt'}, {name: 'mark'}, {name: 'luke'}];
    
    var element = $compile('<concat-strings models="models" field="name"></concat-strings>')($scope);
    $scope.$digest();
    expect(element.isolateScope().identifiers).toEqual('matt mark luke');
  }));
});
