'use strict';

angular.module('liveopsConfigPanel')

  .directive('userState', function() {
    return {

      scope: {
        state: '@'
      },

      link: function($scope, element, attrs) {
        $scope.getDisplayState = function(state) {
          //Temporary logic based on mocks
          switch(state.toLowerCase()) {
            case 'ready' : return 'ready';
            case 'not_ready' : return 'not-ready';
            case 'busy' : return 'busy';
            case 'wrap' : return 'busy';
            default : return 'not-ready';
          }
        };

        attrs.$observe('state', function(value) {
          $scope.stateClass = $scope.getDisplayState(value);
        });

      },

      templateUrl: 'app/shared/directives/userState/userState.html'
    };
  });
