'use strict';

describe('management menu directive', function(){
  var $scope,
    element,
    isolateScope,
    $compile;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$compile', '$rootScope', function(_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;

    $scope.menuLocked = false;
    $scope.config = {
        title: 'title',
        links: [{
          display : 'link1',
          link: '#/',
          id: 'link1'
        }, {
          display : 'link2',
          link: '#/',
          id: 'link2'
        }]
    };

    element = $compile('<management-menu menu-config="config" menu-locked="menuLocked"></management-menu>')($scope);
    $scope.$digest();
    isolateScope = element.isolateScope();
  }]));

  it('should insert an aside element', inject(function() {
    expect(element.find('aside').length).toEqual(1);
  }));

  it('should include the link items', inject(function() {
    expect(element.find('ul').length).toEqual(1);
    expect(element.find('li').length).toEqual(2);
  }));

  it('should collapse the menu by default if it is not locked', inject(function() {
    expect(isolateScope.collapsed).toBeTruthy();
  }));

  it('should show the menu by default if it is locked', inject(function() {
    $scope.menuLocked = true;

    element = $compile('<management-menu menu-config="config" menu-locked="menuLocked"></management-menu>')($scope);
    $scope.$digest();

    expect(element.isolateScope().collapsed).toBeFalsy();
  }));

  describe('mouseleave function', function(){
    it('should collapse the menu if it is not locked', inject(function() {
      isolateScope.menuLocked = false;
      isolateScope.collapsed = false;
      isolateScope.mouseleave();
      expect(isolateScope.collapsed).toBeTruthy();
    }));

    it('should not collapse the menu if it is locked', inject(function() {
      isolateScope.menuLocked = true;
      isolateScope.collapsed = false;
      isolateScope.mouseleave();
      expect(isolateScope.collapsed).toBeFalsy();
    }));
  });
});