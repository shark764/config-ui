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

          $scope.$on('user:create', function () {

            $scope.user = new User({
              status: false,
              state: 'OFFLINE'
            });
          });

          $scope.$watch('user.createdBy', function(){
            if($scope.user && $scope.user.createdBy) {
              $scope.creator = User.get({id : $scope.user.createdBy});
            }
          });

          $scope.$watch('user.updatedBy', function () {
            if($scope.user && $scope.user.updatedBy){
              $scope.updater = User.get({id : $scope.user.updatedBy});
            }
          });

          $scope.save = function () {
            var isCreated = ($scope.user.id ? false : true);

            $scope.user.save({id: $scope.user.id},
              function (result) {

                $scope.user = angular.copy(result);

                if(isCreated){
                  $scope.$emit('user:created', result);
                }
              });
          };
        }
      };
    }
  ]);
