'use strict';

var TOKEN = 'dGl0YW5AbGl2ZW9wcy5jb206Z0tWbmZGOXdyczZYUFNZcw==';

describe('routeSecurity', function () {
  var $scope, $state, $injector, AuthService, Session;

  beforeEach(module('liveopsConfigPanel'));
  beforeEach(module('gulpAngular'));

  beforeEach(inject(['$rootScope', '$state', '$injector', 'AuthService', 'Session', '$httpBackend', 'apiHostname',
    function (_$rootScope_, _$state, _$injector_, _AuthService_, _Session_, $httpBackend, apiHostname) {
      $scope = _$rootScope_.$new();
      $state = _$state;
      $injector = _$injector_;
      AuthService = _AuthService_;
      Session = _Session_;

      $httpBackend.when('GET', apiHostname + '/v1/regions').respond({'result' : [{
        'id': 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f',
        'description': 'US East (N. Virginia)',
        'name': 'us-east-1'
      }]});

      $httpBackend.when('POST', apiHostname + '/v1/login').respond({'result' : {
        'tenants': []
      }});
    }
  ]));


  describe('user is AUTHENTICATED', function () {
    beforeEach(function() {
      Session.token = TOKEN;
    });


    it('should setup route interception and allow access to secure routes', inject(function ($rootScope) {

      Session.token = 'abc';

      $state.go('content.management.users').then(function () {
        var event = $rootScope.$broadcast('$stateChangeStart', {
        });

        expect(event.defaultPrevented).toBeFalsy();
        expect($state.current.name).toBe('content.management.users');

      });
      $scope.$apply();
    }));

  });

  describe('user is NOT AUTHENTICATED', function () {
    it('should setup route interception and prevent access to secure routes', inject(function ($rootScope) {
      $state.go('content.management.users');

      Session.token = null;

      var event = $rootScope.$broadcast('$stateChangeStart', {
      });

      $scope.$apply();

      expect(event.defaultPrevented).toBeTruthy();
      expect($state.current.name).toBe('login');
    }));

    it('should setup route interception and allow access to unsecure routes when not authenticated', inject(function ($rootScope) {
      var event = $rootScope.$broadcast('$stateChangeStart', {
        isPublic: true
      });

      expect(event.defaultPrevented).toBeFalsy();
    }));
  });
});
