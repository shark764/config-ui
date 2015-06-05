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
});