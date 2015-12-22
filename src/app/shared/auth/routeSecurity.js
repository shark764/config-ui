'use strict';
// this function runs once, and only once, to wire up the route
// blocking and redirecting.

// this also wires up the isLoggedIn flag to the rootScope so
// all controllers, directives, etc can see it.

angular.module('liveopsConfigPanel')
  .run(['$rootScope', '$state', 'Session',
    function($rootScope, $state, Session) {
      $rootScope.$on('$stateChangeStart', function(event, next) {

        if (next.isPublic || Session.isAuthenticated()) {
          return;
        }

        event.preventDefault();
        $state.go('login');
      });
    }
  ]);
