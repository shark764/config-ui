'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'User', 'groupTableConfig', 'TenantGroupUsers',
    function ($scope, Session, Group, User, groupTableConfig, TenantGroupUsers) {
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
        group.members.$resolved = true; //Hack to make sure loading spinner goes away
      };

      $scope.$watch('Session.tenant.tenantId', function() {
        $scope.fetch();
      });

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
