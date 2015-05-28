'use strict';

angular.module('liveopsConfigPanel')
  .directive('selectActions', [function() {
    return {
      restrict: 'E',
      scope: {
        users: '='
      },
      link : function($scope) {
        $scope.selectOptions = [
                                {label : 'All', onClick : function(){$scope.selectAll();}}, 
                                {label : 'None', onClick : function(){$scope.selectNone();}}
                               ];
        
        $scope.selectAll = function(){
          $scope.$emit('userList:user:uncheckAll');
          angular.forEach($scope.users, function(user) {
            if (! user.filtered){
              user.checked = true;
              $scope.$emit('userList:user:checked');
            }
          });
        };
        
        $scope.selectNone = function(){
          $scope.$emit('userList:user:uncheckAll');
          angular.forEach($scope.users, function(user) {
            user.checked = false;
          });
        };
      },
      templateUrl: 'app/components/users/selectActions/selectActions.html'
    };
  }]);
