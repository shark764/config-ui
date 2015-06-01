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
            case 'ready' : return 'ready fa-check-circle';
            case 'not_ready' : return 'not-ready fa-times-circle-o';
            case 'busy' : return 'busy fa-check-circle-o';
            case 'wrap' : return 'wrap fa-check-circle';
            default : return 'not-ready fa-times-circle-o';
          }
        };

        attrs.$observe('state', function(value) {
          $scope.stateClass = $scope.getDisplayState(value);
        });

      },

      templateUrl: 'app/shared/directives/userState/userState.html'
    };
  });
