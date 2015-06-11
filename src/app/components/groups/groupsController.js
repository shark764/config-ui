'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$location', '$routeParams', '$filter', 'Session', 'Group', 'User', 'groupTableConfig', 'groupSidebarConfig',
    function($scope, $location, $routeParams, $filter, Session, Group, User, groupTableConfig, groupSidebarConfig) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;
      $scope.sidebarConfig = groupSidebarConfig;

      $scope.groups = Group.query({
        tenantId: Session.tenant.id
      });

      //dummy data until we have members
      var users = User.query();

      $scope.groups.$promise.then(function() {
        users.$promise.then(function(){
          angular.forEach($scope.groups, function(group) {
            group.members = users;
          });
        });
      });

      $scope.createGroup = function() {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.id,
          status: true,
          owner: Session.user.id
        });
      };

    }
  ]);
