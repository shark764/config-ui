'use strict';

angular.module('liveopsConfigPanel')
  .directive('userState', function() {
    var controller = ['$scope', function ($scope) {
      var getDisplayState = function(state){
        if (state == 'online'){
          return 'ready';
        } else if (state == 'busy'){
          return 'busy';
        }else if (state == 'offline'){
          return 'not-ready';
        } else {
          return 'not-ready';
        }
      }
      
      $scope.stateClass = getDisplayState($scope.state);
    }];
  
    return {
      scope: {
        state: '=state'
      },
      controller : controller,
      templateUrl: 'app/components/userState/userState.html'
    };
   })
;
