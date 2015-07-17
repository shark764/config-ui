'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetGroupStatus', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/groups/bulkActions/groupStatus/setGroupStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(group) {
            var groupCopy = angular.copy(group);
            groupCopy.status = $scope.status;
            return groupCopy.save().then(function(groupCopy) {
              angular.copy(groupCopy, group);
              group.checked = true;
              return group;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.status = false;
          };
        }
      };
    }
  ]);
