'use strict';

/*global jasmine: false*/

describe('user managment menu directive', function(){
  var $scope,
    element,
    isolateScope,
    Session;

  beforeEach(function(){
    Session = {collapseSideMenu: true};
    module('liveopsConfigPanel', function ($provide) {
      $provide.value('Session', Session);
    });
  });
  beforeEach(module('gulpAngular'));

    beforeEach(inject(['$compile', '$rootScope', function($compile, $rootScope) {
      $scope = $rootScope.$new();
      
      element = $compile('<user-managment-menu></user-managment-menu>')($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }]));

    it('should insert a nav element', inject(function() {
      expect(element.find('nav').length).toEqual(1);
    }));
    
    describe('toggleCollapse function', function(){
      it('should exist', inject(function() {
        expect(isolateScope.toggleCollapse).toBeDefined();
        expect(isolateScope.toggleCollapse).toEqual(jasmine.any(Function));
      }));
      
      it('should toggle the collapsed state', inject(function() {
        isolateScope.collapsed = false;
        isolateScope.toggleCollapse();
        expect(isolateScope.collapsed).toBeTruthy();
        
        isolateScope.collapsed = true;
        isolateScope.toggleCollapse();
        expect(isolateScope.collapsed).toBeFalsy();
      }));
      
      it('should update the collapsed state in Session', inject(function() {
        isolateScope.collapsed = true;
        isolateScope.toggleCollapse();
        expect(Session.collapseSideMenu).toBeFalsy();
        
        isolateScope.collapsed = false;
        isolateScope.toggleCollapse();
        expect(Session.collapseSideMenu).toBeTruthy();
      }));
    });
});