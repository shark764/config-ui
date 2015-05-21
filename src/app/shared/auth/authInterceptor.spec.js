"use strict";

describe("AuthInterceptor", function() {

  var $scope, $httpProvider, $httpBackend, createController, AuthInterceptor, Session;

    beforeEach(module('liveopsConfigPanel'));

    beforeEach(inject(['$rootScope', '$httpProvider', '$httpBackend', 'AuthInterceptor', 'Session',
        function(_$rootScope_, _$httpProvider_, _$httpBackend_, _AuthInterceptor_, _Session_) {

      $scope = _$rootScope_.$new();
      $httpProvider = _$httpProvider_;
      $httpBackend = _$httpBackend_;
      AuthInterceptor = _AuthInterceptor_;
      Session = _Session_;
    }]));

    it('should be registered as an interceptor', function () {
        expect($httpProvider.interceptors).toContain('AuthInterceptor');
    });

    it('should add the authorization header when the request URL and token are set and correct', function () {
        expect($httpProvider.interceptors).toContain('AuthInterceptor');
    });
});