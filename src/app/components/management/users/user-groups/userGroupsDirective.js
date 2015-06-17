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

        $scope.remove = function (userGroup) {
          $scope.groupId = null;

          var tgu = new TenantGroupUsers({
            memberId: userGroup.memberId,
            groupId: userGroup.groupId,
            tenantId: userGroup.tenantId
          });

          tgu.$delete(function () {
            $scope.fetch();
          });

        };

        $scope.add = function (groupId) {
          $scope.groupId = null;

          var tgu = new TenantGroupUsers({
            userId: $scope.user.id,
            groupId: groupId,
            tenantId: Session.tenant.tenantId
          });

          tgu.$save(function () {
            $scope.fetch();
          });
        };

        $scope.fetch = function () {
          $scope.userGroups = TenantUserGroups.query({ tenantId: Session.tenant.tenantId, userId: $scope.user.id });
        };

        $scope.$watch('user', function () {
          $scope.groupId = null;

          $scope.groups = Group.query({tenantId: Session.tenant.tenantId }, function () {
            $scope.fetch();
          })
        });
      }
    };
  }]);
