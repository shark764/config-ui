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
          $scope.bulkAction.apply = function(tenantUser) {
            if ($scope.status === 'disabled' && tenantUser.id === Session.user.id){
              Alert.error($translate.instant('bulkActions.enable.users.fail'));
              var deferred = $q.defer();
              deferred.reject('Cannot disable your own account');
              return deferred.promise;
            }
            
            var newUser = new User();
            newUser.id = tenantUser.id;
            newUser.status = $scope.status;
            return newUser.save().then(function(user) {
              angular.copy(user, tenantUser.$user);
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
