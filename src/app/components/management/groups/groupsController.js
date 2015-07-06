'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'User', 'groupTableConfig', 'TenantGroupUsers', 'UserCache',
    function ($scope, Session, Group, User, groupTableConfig, TenantGroupUsers, UserCache) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;

      //This is really awful and hopefully the API will update to accommodate this.
      $scope.fetch = function () {
        $scope.groups = Group.query({
          tenantId: Session.tenant.tenantId
        }, function () {
          angular.forEach($scope.groups, function (item, itemKey) {
            $scope.updateMembers($scope.groups[itemKey]);
          });
        });
      };

      $scope.updateMembers = function (group) {
        group.members = TenantGroupUsers.query({
          tenantId: Session.tenant.tenantId,
          groupId: group.id
        }, function () {
          angular.forEach(group.members, function (member, key) {
            UserCache.get(member.memberId, function (data) {
              group.members[key].displayName = data.displayName;
            });
          });
        });
      };

      $scope.additional = {
        postSave: function (childScope) {
          $scope.updateMembers(childScope.resource);
        }
      };

      $scope.$watch('Session.tenant', function() {
        $scope.fetch();
      }, true);

      $scope.$on('on:click:create', function () {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          status: true,
          owner: Session.user.id
        });
      });

      $scope.fetch();
    }
  ]);