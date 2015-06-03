'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', ['User', 'userRoles', 'userStates', 'userStatuses',
    function (User, userRoles, userStates, userStatuses) {
      return {
        scope: {
          user: '='
        },
        templateUrl: 'app/components/users/userDetails/userDetails.html',

        link: function ($scope) {
          $scope.userRoles = userRoles;
          $scope.userStates = userStates;
          $scope.userStatuses = userStatuses;

          $scope.reset = function () {
            $scope.user = {
              status: false,
              state: 'OFFLINE',
              password: 'blah'
            };
          };

          $scope.$on('user:create', function () {
            $scope.reset();
          });

          $scope.save = function () {
            $scope.user.save({id: $scope.user.id},
              function (result) {
                $scope.user = result;
                $scope.$emit('user:created', result);
              });
          };
        }
      };
    }
  ]);