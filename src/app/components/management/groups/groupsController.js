'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'User', 'groupTableConfig', 'TenantGroupUsers', 'DirtyForms', 'BulkAction',
    function ($scope, Session, Group, User, groupTableConfig, TenantGroupUsers, DirtyForms, BulkAction) {
      $scope.Session = Session;
      $scope.tableConfig = groupTableConfig;

      //This is really awful and hopefully the API will update to accommodate this.
      Group.prototype.fetchGroupUsers = function() {
        var members = TenantGroupUsers.cachedQuery({
          tenantId: Session.tenant.tenantId,
          groupId: this.id
        }, 'groups/' + this.id + '/users');
        
        this.members = members; //For table sorting
        return members;
      };

      $scope.fetchGroups = function () {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
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
