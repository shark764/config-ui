'use strict';

describe('NavbarController', function() {
    var $scope, $location, createController, session, $httpBackend;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$rootScope', '$location', '$controller', 'Session', '$httpBackend', function(_$rootScope_, _$location_, $controller, _session_, _$httpBackend_) {
      $scope = _$rootScope_.$new();
      $location = _$location_;
      session = _session_;
      $httpBackend = _$httpBackend_;
      
      createController = function () {
          return $controller('NavbarController', {
              '$scope': $scope,
          });
      };

    }]));

    it('should have a method to check if the path is active', function() {
        createController();

        $location.path('/users');

        expect($location.path()).toBe('/users');
        expect($scope.isActive('/users')).toBe(true);
        expect($scope.isActive('/contact')).toBe(false);
    });

    it('should have a method to log the user out and redirect them to the login page', function() {
        createController();

        $location.path('/users');
        session.set('abc', 'John');

        expect(session.isAuthenticated).toBe(true);
        expect($location.path()).toBe('/users');

        $scope.logout();

        expect(session.isAuthenticated).toBe(false);
    });
    
    it('should load the tenants for the region', function() {
      $httpBackend.when('GET', 'fakendpoint.com/v1/tenants?regionId=c98f5fc0-f91a-11e4-a64e-7f6e9992be1f').respond({'result' : [{id: 1}, {id: 2}]});
      $httpBackend.expectGET('fakendpoint.com/v1/tenants?regionId=c98f5fc0-f91a-11e4-a64e-7f6e9992be1f');
      createController();
      $httpBackend.flush();
      
      expect($scope.tenants.length).toEqual(2);
  });
});