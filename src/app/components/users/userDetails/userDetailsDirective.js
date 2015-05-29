'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', ['UserService', 'userRoles', 'userStates', 'userStatuses',
    function (UserService, userRoles, userStates, userStatuses) {
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

          if (!$scope.user) {
            $scope.reset();
          }

          $scope.$on('user:create', function () {
            $scope.reset();
          });

          $scope.trimmedUser = function (user) {
            return {
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              externalId: user.externalId,
              email: user.email,
              displayName: user.displayName,
              status: user.status,
              password: user.password,
              state: user.state
            };
          };

          $scope.save = function () {
            var promise;
            var trimmedUser = $scope.trimmedUser($scope.user);
            if ($scope.user.id) {
              promise = UserService.update({
                id: $scope.user.id
              }, trimmedUser).$promise;
            } else {
              promise = UserService.save($scope.trimmedUser($scope.user)).$promise;

              promise.then(function (response) {
                $scope.$emit('user:created', response.result);
                return response;
              });
            }

            promise.then(function (response) {
              $scope.user = response.result;
            });
          };
        }
      };
    }
  ]);