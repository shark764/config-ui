'use strict';

angular.module('liveopsConfigPanel')
  .directive('batchButtons', [function() {
    return {
      restrict: 'E',
      scope: {
        users: '='
      },
      link : function($scope) {
        $scope.enableChecked = function(){
          angular.forEach($scope.users, function(user) {
            if (user.checked && ! user.filtered){
              $scope.$emit('user:update', {userId: user.id, data:{'status' : true}});
              user.status = true;
            }
          });
        };
        
        $scope.disableChecked = function(){
          angular.forEach($scope.users, function(user) {
            if (user.checked && ! user.filtered){
              $scope.$emit('user:update', {userId: user.id, data:{'status' : false}});
              user.status = false;
            }
          });
        };
      },
      templateUrl: 'app/components/users/batchButtons/batchButtons.html'
    };
  }]);
