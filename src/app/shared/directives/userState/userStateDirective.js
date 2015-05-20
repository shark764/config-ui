'use strict';

angular.module('liveopsConfigPanel')
  .directive('userState', function() {
    var controller = ['$scope', function ($scope) {
      var getDisplayState = function(state){
        switch(state.toLowerCase()) {
          case 'online' : return 'ready';
          case 'busy' : return 'busy';
          case 'offline' : return 'not-ready';
          default : return 'not-ready';
        }
      };
      
      $scope.stateClass = getDisplayState($scope.state);
    }];
  
    return {
      scope: {
        state: '=state'
      },
      controller : controller,
      templateUrl: 'app/shared/directives/userState/userState.html'
    };
   })
;
