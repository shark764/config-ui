'use strict';

angular.module('liveopsConfigPanel')
  .directive('userGroups', ['TenantUserGroups', 'TenantGroupUsers', 'Group', 'Session', function (TenantUserGroups, TenantGroupUsers, Group, Session) {
    return {
      restrict: 'E',

      scope: {
        user: '='
      },

      templateUrl: 'app/components/management/users/user-groups/userGroups.html',

      link: function ($scope) {
        $scope.groupId = null;

        $scope.delete = function (userGroup) {
          userGroup.delete(userGroup, function (){
            $scope.userGroups.remove(userGroup);
          });
        };

        $scope.add = function (groupId) {
          var tgu = new TenantGroupUsers();

          tgu.userId = $scope.user.id;

          tgu.save({ groupId: $scope.groupId, tenantId: Session.tenant.tenantId }, function () {
            $scope.fetch();
            $scope.groupId = null;
          });
        };

        $scope.fetch = function () {
          $scope.userGroups = TenantUserGroups.query({ tenantId: Session.tenant.tenantId, userId: $scope.user.id });
        };

        $scope.new = function() {
          if($scope.groups && $scope.groups.length  > 0){
            $scope.groupId = $scope.groups[0].id;
          }
        };

        $scope.groups = Group.query({tenantId: Session.tenant.tenantId }, function () {
          $scope.fetch();
        })
      }
    };
  }]);
