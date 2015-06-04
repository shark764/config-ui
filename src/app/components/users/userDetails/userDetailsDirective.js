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

          $scope.cancel = function(){
            $scope.$emit('user:cancel');
          };
          
          $scope.$on('user:create', function () {

            $scope.user = new User({
              status: false,
              state: 'OFFLINE'
            });
          });

          $scope.save = function () {
            $scope.user.save({id: $scope.user.id},
              function (result) {

                $scope.user = result;

                if(!$scope.user.id){
                  $scope.$emit('user:created', result);
                }
              });
          };
        }
      };
    }
  ]);
