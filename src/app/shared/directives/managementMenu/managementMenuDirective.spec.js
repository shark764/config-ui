'use strict';

describe('management menu directive', function(){
  var $scope,
    element,
    isolateScope,
    $compile,
    Session,
    template;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', '$templateCache', function(_$compile_, $rootScope, $templateCache) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    
    template = "<nav><ul><li></li><li></li></ul></nav>";
    $templateCache.put('template', template);
    $scope.menuLocked = false;
    
    element = $compile('<management-menu template-url="template" menu-locked="menuLocked"></management-menu>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should insert an aside element when template-url is included', inject(function() {
    expect(element.find('aside').length).toEqual(1);
  }));
  
  it('should include html from the template url', inject(function() {
    expect(element.find('ul').length).toEqual(1);
    expect(element.find('li').length).toEqual(2);
  }));
  
  it('should not have an aside when no template url is included', inject(function() {
    element = $compile('<management-menu></management-menu>')($scope);
    $scope.$digest();
    
    expect(element.find('aside').length).toEqual(0);
  }));
  
  it('should collapse the menu by default if it is not locked', inject(function() {
    expect(isolateScope.collapsed).toBeTruthy();
  }));
  
  it('should show the menu by default if it is locked', inject(function() {
    $scope.menuLocked = true;
    
    element = $compile('<management-menu template-url="template" menu-locked="menuLocked"></management-menu>')($scope);
    $scope.$digest();
    
    expect(element.isolateScope().collapsed).toBeFalsy();
  }));
});