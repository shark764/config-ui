'use strict';

describe('navbar directive', function(){
  var $scope,
    element;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  describe('when authenticated', function(){
    beforeEach(inject(['$compile', '$rootScope', 'navbarDirective', function($compile, $rootScope, navbarDirective) {
      //Mock out the controller for this directive, so we don't have to worry about httpd calls, etc, that it might make
      var directiveDefinition = navbarDirective[0];
      directiveDefinition.controller = function($scope) {
        $scope.tenants = {result: [{name: 'one', id:1}, {name : 'two', id:2}, {name: 'three', id:3}]};
        $scope.Session = {isAuthenticated : true, fullName : 'Bob Bobberton'};
      };

      $scope = $rootScope.$new();
      element = $compile('<navbar></navbar>')($scope);
      $scope.$digest();
    }]));

    it('should insert a nav element', inject(function() {
      expect(element.find('nav').length).toEqual(1);
    }));

    it('should insert a welcome message', inject(function() {
      var welcomeElement = element[0].querySelector('.welcome');
      expect(angular.element(welcomeElement).length).toEqual(1);
    }));
  });
});