'use strict';

describe('AuthInterceptor', function() {

  var $scope, $httpProviderIt, $httpBackend, AuthInterceptor, Session, hostname;

    beforeEach(module('liveopsConfigPanel', function($httpProvider){
      $httpProviderIt = $httpProvider;
    }));

    beforeEach(inject(['$rootScope', '$httpBackend', 'AuthInterceptor', 'Session', 'apiHostname',
        function(_$rootScope_, _$httpBackend_, _AuthInterceptor_, _Session_, _hostname_) {

      hostname = _hostname_;
      $scope = _$rootScope_.$new();
      $httpBackend = _$httpBackend_;
      AuthInterceptor = _AuthInterceptor_;
      Session = _Session_;
    }]));

    it('should be registered as an interceptor', function () {
        expect($httpProviderIt.interceptors).toContain('AuthInterceptor');
    });

    it('should add the authorization header when the request URL and token are set and correct', function () {
      Session.token = 'abc123';

      var config = AuthInterceptor.request({ url : hostname + '/v1/users', headers: {} });

      expect(config.headers.Authorization).toBe('Basic ' + Session.token);
    });

    it('should not add the authorization header when the request URL is not valid', function () {
      Session.token = 'abc123';

      var config = AuthInterceptor.request({ url : 'http://google.com', headers: {} });

      expect(config.headers.Authorization).not.toBeDefined();
    });

    it('should not add the authorization header when the token is not valid', function () {
      Session.token = '';

      var config = AuthInterceptor.request({ url : hostname + '/v1/users', headers: {} });

      expect(config.headers.Authorization).not.toBeDefined();
    });
    
    it('should destroy the session if any API call returns 401', function () {
      var promise = AuthInterceptor.responseError({ status: 401 });
      
      expect(promise.$$state.status).toEqual(2);
      expect(promise.$$state.value.status).toEqual(401);
    });
});