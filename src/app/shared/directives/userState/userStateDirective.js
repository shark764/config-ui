'use strict';

angular.module('liveopsConfigPanel')
  .directive('userState', function() {
    var link = function(scope) {
      function getDisplayState(state) {
        //Temporary logic based on mocks
        switch(state.toLowerCase()) {
          case 'ready' : return 'ready';
          case 'not_ready' : return 'not-ready';
          case 'busy' : return 'busy';
          case 'wrap' : return 'busy';
          default : return 'not-ready';
        }
      }

      scope.stateClass = getDisplayState(scope.state);
    };

    return {
      scope: {
        state: '@'
      },
      link: link,
      templateUrl: 'app/shared/directives/userState/userState.html'
    };
  });
