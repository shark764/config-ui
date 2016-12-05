'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'TenantUser', 'groupTableConfig', 'TenantGroupUsers', 'queryCache', '$filter', 'Alert', '$translate', 'loEvents',
    function($scope, Session, Group, TenantUser, groupTableConfig, TenantGroupUsers, queryCache, $filter, Alert, $translate, loEvents) {
      $scope.Session = Session;
      $scope.tableConfig = groupTableConfig;

      //This is really awful and hopefully the API will update to accommodate this.
      Group.prototype.fetchGroupUsers = function() {
        var result = TenantGroupUsers.cachedQuery({
          tenantId: Session.tenant.tenantId,
          groupId: this.id
        }, 'groups/' + this.id + '/users');

        if ($scope.selectedGroup) {
          $scope.selectedGroup.$memberList = result;
        }

        this.$members = result;
        return result;
      };

      $scope.fetchUsers = function() {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchGroups = function() {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          active: true,
          owner: Session.user.id
        });
      });

      $scope.addMember = function(user) {
        TenantGroupUsers.save({
          tenantId: Session.tenant.tenantId,
          groupId: $scope.selectedGroup.id,
          userId: user.id
        }, function(resp) {
          $scope.selectedGroup.$memberList.push(resp);
          queryCache.remove('TenantUser');
          $scope.reset();
          Alert.success($translate.instant('group.table.add.member'));
        }, function() {
          Alert.error($translate.instant('group.table.add.member.error'));
        });
      };

      $scope.removeMember = function(user) {
        TenantGroupUsers.delete({
          tenantId: Session.tenant.tenantId,
          groupId: $scope.selectedGroup.id,
          memberId: user.memberId
        }, function() {
          $scope.selectedGroup.$memberList.removeItem(user);
          queryCache.remove('TenantUser');
          Alert.success($translate.instant('group.table.remove.member'));
        }, function() {
          Alert.error($translate.instant('group.table.remove.member.error'));
        });
      };

      $scope.filterUsers = function(item) {
        if ($scope.selectedGroup) {
          var matchingUsers = $filter('filter')($scope.selectedGroup.fetchGroupUsers(), {
            'memberId': item.id
          }, true);
          return matchingUsers.length === 0;
        }
      };

      $scope.submit = function() {
        return $scope.selectedGroup.save(function(result) {
          result.fetchGroupUsers();
        });
      };

      $scope.reset = function() {
        $scope.typeahead = {
          selectedUser: null
        };
      };

      $scope.updateActive = function(){
        var groupCopy = new Group({
          id: $scope.selectedGroup.id,
          tenantId: $scope.selectedGroup.tenantId,
          active: ! $scope.selectedGroup.active
        });

        return groupCopy.save(function(result){
          $scope.selectedGroup.$original.active = result.active;
        });
      };

      $scope.reset();
    }
  ]);
