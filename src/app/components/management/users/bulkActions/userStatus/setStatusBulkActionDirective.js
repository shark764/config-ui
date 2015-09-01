'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetStatus', ['TenantUser', 'Session', '$q', 'Alert', '$translate',
    function (TenantUser, Session, $q, Alert, $translate) {
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
            
            var newUser = new TenantUser();
            newUser.id = tenantUser.id;
            newUser.status = $scope.status;
            newUser.tenantId = tenantUser.tenantId;
            return newUser.save().then(function(userCopy){
              angular.copy(userCopy, tenantUser);
              tenantUser.checked = true;
              return tenantUser;
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
