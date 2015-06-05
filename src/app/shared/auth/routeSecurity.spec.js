'use strict';

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';

describe('routeSecurity', function () {
  var $scope, $location, $injector, AuthService, Session;

  beforeEach(module('liveopsConfigPanel'));

  beforeEach(inject(['$rootScope', '$location', '$injector', 'AuthService', 'Session',
    function (_$rootScope_, _$location_, _$injector_, _AuthService_, _Session_) {
      $scope = _$rootScope_.$new();
      $location = _$location_;
      $injector = _$injector_;
      AuthService = _AuthService_;
      Session = _Session_;
    }
  ]));

  
  describe('user is AUTHENTICATED', function () {
    beforeEach(function() {
      Session.token = TOKEN;
    });
    
    
    it('should setup route interception and prevent access to secure routes', inject(function ($rootScope) {
      $location.path('/users');

      var event = $rootScope.$broadcast('$routeChangeStart', {
        secure: true,
        $$route: {
          controller: 'BlargController'
        }
      });

      expect(event.defaultPrevented).toBeFalsy();
      expect($location.path()).toBe('/users');
    }));
  
    it('should setup route interception and route to / when user is authenticated and hits /login', inject(function ($rootScope) {
      $location.path('/');
      
      var event = $rootScope.$broadcast('$routeChangeStart', {
        secure: true,
        $$route: {
          controller: 'LoginController'
        }
      });

      expect(event.defaultPrevented).toBeTruthy();
      expect($location.path()).toBe('/');
    }));
  });
  
  describe('user is NOT AUTHENTICATED', function () {
    it('should setup route interception and prevent access to secure routes', inject(function ($rootScope) {
      $location.path('/users');

      Session.token = null;

      var event = $rootScope.$broadcast('$routeChangeStart', {
        secure: true,
        $$route: {
          controller: 'BlargController'
        }
      });

      expect(event.defaultPrevented).toBeTruthy();
      expect($location.path()).toBe('/login');
    }));

    it('should setup route interception and allow access to unsecure routes when not authenticated', inject(function ($rootScope) {
      $location.path('/blarg');

      var event = $rootScope.$broadcast('$routeChangeStart', {
        secure: false,
        $$route: {
          controller: 'BlargController'
        }
      });

      expect(event.defaultPrevented).toBeFalsy();
      expect($location.path()).toBe('/blarg');
    }));
  });
});