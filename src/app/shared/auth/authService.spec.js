'use strict';

/* global spyOn: false  */

describe('AuthService', function() {
var $scope, $location, AuthService, Session;

beforeEach(module('liveopsConfigPanel'));

beforeEach(inject(['$rootScope', '$location', 'AuthService', 'Session', function(_$rootScope_, _$location_, _AuthService_, _Session_) {
  $scope = _$rootScope_.$new();
  $location = _$location_;
  AuthService = _AuthService_;
  Session = _Session_;
}]));

it('should have a method get an authentication token', function() {
  var username = 'john',
  password = 'password';

  var token = AuthService.generateToken(username, password);

  expect(token).toBe('am9objpwYXNzd29yZA==');
});

it('should have a method to login which sets the session', function() {
  var username = 'john',
  password = 'password';

  spyOn(Session, 'set');

  AuthService.login(username, password);

  expect(Session.set).toHaveBeenCalledWith(AuthService.generateToken(username, password), 'Ron', '1c838030-f772-11e4-ac37-45b2e1245d4b', 'en');
});


it('should have a method to logout which destroys the session', function() {
  spyOn(Session, 'destroy');

  AuthService.logout();

  expect(Session.destroy).toHaveBeenCalled();
  expect(Session.token).toBeNull();
});


it('should setup route interception and prevent access to secure routes when authenticated', inject(function ($rootScope) {
  $location.path('/users');

  Session.isAuthenticated = true;

  var event = $rootScope.$broadcast('$routeChangeStart', { $$route : { secure : true } });

  expect(event.defaultPrevented).toBeFalsy();
  expect($location.path()).toBe('/users');
}));

it('should setup route interception and prevent access to secure routes when not authenticated', inject(function ($rootScope) {
  $location.path('/users');

  var event = $rootScope.$broadcast('$routeChangeStart', { $$route : { secure : true } });

  expect(event.defaultPrevented).toBeTruthy();
  expect($location.path()).toBe('/login');
}));

it('should setup route interception and allow access to unsecure routes when not authenticated', inject(function ($rootScope) {
  $location.path('/blarg');

  var event = $rootScope.$broadcast('$routeChangeStart', { $$route : { secure : false } });

  expect(event.defaultPrevented).toBeFalsy();
  expect($location.path()).toBe('/blarg');
}));

});