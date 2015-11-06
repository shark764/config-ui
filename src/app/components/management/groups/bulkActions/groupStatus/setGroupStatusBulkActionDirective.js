'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetGroupStatus', ['Group', 'Session', 'Alert', '$q', '$translate', 'BulkAction',
    function (Group, Session, Alert, $q, $translate, BulkAction) {
      return {
        restrict: 'AE',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/groups/bulkActions/groupStatus/setGroupStatusBulkAction.html',
        link: function ($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          
          if(bulkActionExecutor){
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.bulkAction.apply = function(group) {
            if (group.type === 'everyone'){
              Alert.error($translate.instant('bulkActions.enable.groups.fail'));
              var deferred = $q.defer();
              deferred.reject('Cannot disable the Everyone group');
              return deferred.promise;
            }
            
            var groupCopy = new Group();
            groupCopy.id = group.id;
            groupCopy.tenantId = Session.tenant.tenantId;
            groupCopy.active = $scope.active;
            return groupCopy.save().then(function(groupCopy) {
              angular.copy(groupCopy, group);
              group.checked = true;
              return group;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };
        }
      };
    }
  ]);
