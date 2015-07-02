'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$q', 'Session', 'Group', 'User', 'groupTableConfig', 'TenantGroupUsers', 'UserCache',
    function ($scope, $q, Session, Group, User, groupTableConfig, TenantGroupUsers, UserCache) {
      var self = this;
      $scope.Session = Session;
      $scope.tableConfig = groupTableConfig;

      //This is really awful and hopefully the API will update to accommodate this.
      this.fetch = function () {
        $scope.groups = Group.query({
          tenantId: Session.tenant.tenantId
        }, function () {
          angular.forEach($scope.groups, function (group) {
            self.updateMembers(group);
          });
        });
      };

      this.updateMembers = function (group) {
        group.members = TenantGroupUsers.query({
          tenantId: Session.tenant.tenantId,
          groupId: group.id
        }, function() {
          $scope.$broadcast('originalResource:changed', group);
        });

        return group.members.$promise;
      };

      Group.prototype.postUpdate = function(group) {
        return self.updateMembers(group);
      };

      $scope.$watch('Session.tenant', function() {
        self.fetch();
      }, true);

      $scope.$on('on:click:create', function () {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          status: true,
          owner: Session.user.id
        });
      });

      this.fetch();
    }
  ]);
