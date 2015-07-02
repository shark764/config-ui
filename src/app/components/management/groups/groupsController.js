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
          angular.forEach($scope.groups, function (group) {
            $scope.updateMembers(group);
          });
        });
      };

      $scope.updateMembers = function (group) {
        group.members = TenantGroupUsers.query({
          tenantId: Session.tenant.tenantId,
          groupId: group.id
        }, function() {
          $scope.$broadcast('resource:details:originalResource:changed', group);
        });

        return group.members;
      };

      Group.prototype.postUpdate = function(group) {
        return $scope.updateMembers(group).$promise
          .then(function(members) {
            //Need group to be returned at the tail of the promise/
            return group;
          });
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
