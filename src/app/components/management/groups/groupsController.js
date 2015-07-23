'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'User', 'groupTableConfig', 'TenantGroupUsers', 'DirtyForms', 'BulkAction',
    function ($scope, Session, Group, User, groupTableConfig, TenantGroupUsers, DirtyForms, BulkAction) {
      $scope.Session = Session;
      $scope.tableConfig = groupTableConfig;

      //This is really awful and hopefully the API will update to accommodate this.
      $scope.fetchGroups = function () {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        }, function (groups) {
          angular.forEach(groups, function (group) {
            $scope.updateMembers(group);
          });
        });
      };

      $scope.updateMembers = function (group) {
        group.members = TenantGroupUsers.query({
          tenantId: Session.tenant.tenantId,
          groupId: group.id
        });

        return group.members;
      };

      Group.prototype.postUpdate = function(group) {
        return $scope.updateMembers(group).$promise
          .then(function() {
            //Need group to be returned at the tail of the promise/
            return group;
          });
      };

      Group.prototype.postCreate = function(group) {
        //Display logic only, as we dont add/edit group users from this screen
        group.members = [];
      };

      $scope.$on('table:on:click:create', function () {
        $scope.showBulkActions = false;

        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          status: true,
          owner: Session.user.id
        });
      });

      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });

      $scope.bulkActions = {
        setGroupStatus: new BulkAction()
      };
    }
  ]);
