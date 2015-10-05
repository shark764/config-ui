'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'User', 'groupTableConfig', 'TenantGroupUsers', 'DirtyForms', 'BulkAction', '$state',
    function ($scope, Session, Group, User, groupTableConfig, TenantGroupUsers, DirtyForms, BulkAction, $state) {
      $scope.Session = Session;
      $scope.tableConfig = groupTableConfig;

      //This is really awful and hopefully the API will update to accommodate this.
      Group.prototype.fetchGroupUsers = function () {
        var result = TenantGroupUsers.cachedQuery({
          tenantId: Session.tenant.tenantId,
          groupId: this.id
        }, 'groups/' + this.id + '/users');
        
        this.members = result;
        return result;
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

      $scope.gotoUserPage = function (userId) {
        $state.transitionTo('content.management.users', {
          id: userId
        });
      };
      
      $scope.submit = function(){
        delete $scope.selectedGroup.members;
        
        return $scope.selectedGroup.save(function(result){
          result.fetchGroupUsers();
        })
      };
    }
  ]);