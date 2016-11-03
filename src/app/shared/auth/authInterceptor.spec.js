'use strict';

describe('AuthInterceptor', function() {
  var $scope,
    $httpProviderIt,
    $httpBackend,
    AuthInterceptor,
    Session,
    hostname;

  beforeEach(module('liveopsConfigPanel', function($httpProvider) {
    $httpProviderIt = $httpProvider;
  }));

  beforeEach(inject(['$rootScope', '$httpBackend', 'AuthInterceptor', 'Session', 'apiHostname',
    function($rootScope, _$httpBackend, _AuthInterceptor, _Session, _hostname) {
      hostname = _hostname;
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend;
      AuthInterceptor = _AuthInterceptor;
      Session = _Session;
    }
  ]));

  it('should be registered as an interceptor', function() {
    expect($httpProviderIt.interceptors).toContain('AuthInterceptor');
  });

  it('should add the authorization header when the request URL and token are set and correct', function() {
    Session.token = 'abc123';

    var config = AuthInterceptor.request({
      url: hostname + '/v1/users',
      headers: {}
    });

    expect(config.headers.Authorization).toBe('Token ' + Session.token);
  });

  it('should not add the authorization header when the request URL is not valid', function() {
    Session.token = 'abc123';

    var config = AuthInterceptor.request({
      url: 'http://google.com',
      headers: {}
    });

    expect(config.headers.Authorization).not.toBeDefined();
  });

  it('should not add the authorization header when the token is not valid', function() {
    Session.token = '';

    var config = AuthInterceptor.request({
      url: hostname + '/v1/users',
      headers: {}
    });

    expect(config.headers.Authorization).not.toBeDefined();
  });
});
