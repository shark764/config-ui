'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetGroupStatus', ['Group', 'Session', 'Alert', '$q', '$translate',
    function (Group, Session, Alert, $q, $translate) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/groups/bulkActions/groupStatus/setGroupStatusBulkAction.html',
        link: function ($scope) {
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
