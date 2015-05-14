'use strict';

requirejs.config({
  baseUrl: 'app',

  paths: {
    angular: '../bower/angular/angular',
    angularAnimate: '../bower/angular-animate/angular-animate',
    angularTouch: '../bower/angular-touch/angular-touch',
    angularSanitize: '../bower/angular-sanitize/angular-sanitize',
    angularRoute: '../bower/angular-route/angular-route',
    angularCookies: '../bower/angular-cookies/angular-cookies',
    angularResource: '../bower/angular-resource/angular-resource',
    domReady: '../bower/domReady/domReady',
    text: '../bower/text/text'
  },
  shim :{
    angular: {
      exports: 'angular'
    },
    angularRoute: {
      deps: ['angular']
    },
    angularAnimate: {
      deps: ['angular']
    },
    angularTouch: {
      deps: ['angular']
    },
    angularSanitize: {
      deps: ['angular']
    },
    angularCookies: {
      deps: ['angular']
    },
    angularResource: {
      deps: ['angular']
    }
  }

});


require([
  'angular',
  'angularAnimate',
  'angularTouch',
  'angularSanitize',
  'angularRoute',
  'angularCookies',
  'angularResource',
  'domReady',
  'main/main.controller',
  'components/navbar/navbar.controller',
  'text!main/main.html'

], function (angular, angularAnimate, angularTouch, angularSanitize, angularRoute, angularCookies, angularResource, domReady, MainControllerModule, NavBarModule, mainTemplate) {
  angular.module('liveops-config-panel', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute', MainControllerModule.name, NavBarModule.name])

  .config(function ($routeProvider) {
    $routeProvider
      .when('', {
        redirectTo: '/'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  require(['domReady'], function(){
    angular.bootstrap(document, ['liveops-config-panel']);
  });

})