'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', [ 'UserService', function(UserService) {
    return {

      scope: {
        user: '='
      },

      templateUrl: 'app/components/users/userDetails/userDetails.html',

      link: function($scope) {

        $scope.trimmedUser = function(user) {
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            extensionId: user.extensionId,
            email: user.email,
            displayName: user.displayName,
            status: user.status
          };
        };

        $scope.save = function () {
          UserService.update({id : $scope.user.id}, $scope.trimmedUser($scope.user));
        };

      }
    };
 }]);
