'use strict';

describe('dropdown directive', function(){
  var $scope,
    $compile,
    $document,
    element,
    items,
    isolateScope;
  
  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular')); 
  
  beforeEach(inject(['$compile', '$rootScope', '$document', function(_$compile_,_$rootScope_, _$document_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $document = _$document_;
    
    items = [
             {label: 'One', onClick: function(){return 'You clicked one!';}},
             {label: 'Another', onClick: function(){return 'The other thing was called!';}}
            ];
    $scope.items = items;
    
    element = $compile('<dropdown label="My Dropdown" items="items"></filter-dropdown>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));
  
  it('should add an li item for each item given', inject(function() {
    expect(element.find('li').length).toEqual(2);
  }));
  
  describe('optionClick function', function(){
    it('should call the given function', inject(function() {
      var wasCalled = false;
      isolateScope.optionClick(function(){wasCalled = true;});
      
      expect(wasCalled).toBeTruthy();
    }));
    
    it('should hide the dropdown', inject(function() {
      isolateScope.showDrop = true;
      isolateScope.optionClick(function(){return true;});
      expect(isolateScope.showDrop).toBeFalsy();
    }));
  });
});
