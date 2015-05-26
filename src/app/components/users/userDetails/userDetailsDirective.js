'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', function() {
    return {
      scope: {
        user: '='
      },
      templateUrl: 'app/components/users/userDetails/userDetails.html',
      link: function(scope) {
        
        scope.$watch('user', function() {
          if(!scope.user){
            return;
          }
          
          scope.display = {
            firstName: scope.user.firstName,
            lastName: scope.user.lastName,
            displayName: scope.user.displayName,
            state: scope.user.state,
            created: scope.user.created,
            createdBy: scope.user.createdBy
          };
        });
      }
    };
 });
