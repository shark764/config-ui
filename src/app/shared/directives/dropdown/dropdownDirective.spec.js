'use strict';

describe('dropdown directive', function(){
  var $scope,
    $compile,
    element,
    items;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', function(_$compile_,_$rootScope_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    
    items = [
             {label: 'One', onClick: function(){return 'You clicked one!'}},
             {label: 'Another', onClick: function(){return 'The other thing was called!'}}
            ];
    $scope.items = items;
    
    element = $compile('<dropdown label="My Dropdown" items="items"></filter-dropdown>')($scope);
    $scope.$digest();
  }]));

  it('should add an li item for each item given', inject(function() {
    expect(element.find('li').length).toEqual(2);
  }));
});
