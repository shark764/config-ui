'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetStatus', ['User', 'Session', '$q', 'Alert', '$translate',
    function (User, Session, $q, Alert, $translate) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/userStatus/setStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(user) {
            if ($scope.status === 'disabled' && user.id === Session.user.id){
              Alert.error($translate.instant('bulkActions.enable.users.fail'));
              var deferred = $q.defer();
              deferred.reject('Cannot disable your own account');
              return deferred.promise;
            }
            
            var userCopy = new User();
            userCopy.id = user.id;
            userCopy.status = $scope.status;
            return userCopy.save().then(function(userCopy) {
              angular.copy(userCopy, user);
              user.checked = true;
              return user;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.status = 'disabled';
          };
          
          $scope.bulkAction.reset();
        }
      };
    }
  ]);
