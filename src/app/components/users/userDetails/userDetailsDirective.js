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
              status: true,
              state: 'OFFLINE'
            });
          });
          
          $scope.$watch('user', function(){
            if ($scope.user && $scope.user.id){
              $scope.creator = User.get({id : $scope.user.createdBy});
              $scope.updater = User.get({id : $scope.user.updatedBy});
            }
          });
          
          $scope.save = function () {
            var isCreated = ($scope.user.id ? false : true);

            $scope.user.save({id: $scope.user.id},
              function (result) {

                $scope.user = result;

                if(isCreated){
                  $scope.$emit('user:created', result);
                }
              });
          };
        }
      };
    }
  ]);
