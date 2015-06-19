'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'User', 'groupTableConfig', 'TenantGroupUsers', 'UserName',
    function($scope, Session, Group, User, groupTableConfig, TenantGroupUsers, UserName) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;

      $scope.$watch('Session.tenant', function () {
        $scope.fetch();
      });

      //This is really awful and hopefully the API will update to accommodate this.
      $scope.fetch = function () {
        $scope.groups = Group.query({tenantId: Session.tenant.tenantId}, function(){
          angular.forEach($scope.groups, function(item, itemKey){
            $scope.updateMembers($scope.groups[itemKey]);
          });
        });
      };
      
      $scope.additional = {
          postSave : function(childScope){
            //Need to do both because updating is asynchronous, 
            //and ResourceDetails will copy resource into originalResource before updateMembers completes
            //Meaning one or both of them will be missing the list of members
            //Hooray for races.
            $scope.updateMembers(childScope.resource);
            $scope.updateMembers(childScope.originalResource);
          }
      };
      
      $scope.updateMembers = function(group){
        group.members = TenantGroupUsers.query({tenantId: Session.tenant.tenantId, groupId: group.id}, function(){
          angular.forEach(group.members, function(member, key){
            UserName.get(member.memberId, function(data){
              group.members[key].displayName = data.displayName;
            });
          });
        });
      };

      $scope.$on('on:click:create', function(){
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          status: true,
          owner: Session.user.id
        });
      });

      $scope.fetch();
    }
  ]);
