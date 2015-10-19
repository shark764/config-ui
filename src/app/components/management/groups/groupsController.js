'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'TenantUser', 'groupTableConfig', 'TenantGroupUsers', 'DirtyForms', 'BulkAction', 'Alert', '$state', '$translate',
    function ($scope, Session, Group, TenantUser, groupTableConfig, TenantGroupUsers, DirtyForms, BulkAction, Alert, $state, $translate) {
      $scope.Session = Session;
      $scope.tableConfig = groupTableConfig;

      //This is really awful and hopefully the API will update to accommodate this.
      Group.prototype.fetchGroupUsers = function () {

        var result = TenantGroupUsers.cachedQuery({
          tenantId: Session.tenant.tenantId,
          groupId: this.id
        }, 'groups/' + this.id + '/users');

        if ($scope.selectedGroup){
          $scope.selectedGroup.memberList = result;
        }
        
        this.members = result;
        return result;
      };

     $scope.fetchUsers = function () {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.fetchGroups = function () {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          active: true,
          owner: Session.user.id
        });
      });

      $scope.bulkActions = {
        setGroupStatus: new BulkAction()
      };

      $scope.addMember = function (user) {
        TenantGroupUsers.save({
          tenantId: Session.tenant.tenantId,
          groupId: $scope.selectedGroup.id,
          userId: user.id
        }, function (resp){
          $scope.selectedGroup.memberList.push(resp);
          Alert.success($translate.instant('group.table.add.member'));
        }, function () {
          Alert.error($translate.instant('group.table.add.member.error'));
        });
      };

      $scope.removeMember = function (user) {
        TenantGroupUsers.delete({
          tenantId : Session.tenant.tenantId,
          groupId:$scope.selectedGroup.id,
          memberId: user.memberId
        }, function (resp) {
          $scope.selectedGroup.memberList.removeItem(user);
          Alert.success($translate.instant('group.table.remove.member'));
        }, function () {
          Alert.error($translate.instant('group.table.remove.member.error'));
        });
      };

      $scope.gotoUserPage = function (userId) {
        $state.transitionTo('content.management.users', {
          id: userId
        });
      };
      
      $scope.submit = function(){
        delete $scope.selectedGroup.members;
        
        return $scope.selectedGroup.save(function(result){
          result.fetchGroupUsers();
        });
      };
    }
  ]);