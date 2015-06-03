'use strict';
// this function runs once, and only once, to wire up the route
// blocking and redirecting.

// this also wires up the isLoggedIn flag to the rootScope so
// all controllers, directives, etc can see it.

angular.module('liveopsConfigPanel')
  .run(['$rootScope', '$location', 'Session',
    function ($rootScope, $location, Session) {
      $rootScope.$on('$routeChangeStart', function (event, next) {
        if(Session.isAuthenticated() && next.$$route.controller === 'LoginController'){
          event.preventDefault();
          $location.path('/');
        }
        
        if (next.secure && !Session.isAuthenticated()) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    }
  ]);