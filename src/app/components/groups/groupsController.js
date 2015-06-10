'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$location', '$routeParams', '$filter', 'Session', 'Group', 'User', 'groupTableConfig', 'groupSidebarConfig',
    function($scope, $location, $routeParams, $filter, Session, Group, User, groupTableConfig, groupSidebarConfig) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;
      $scope.sidebarConfig = groupSidebarConfig;

      $scope.users = User.query();

      $scope.groups = Group.query({
        tenantId: Session.tenant.id
      });

      $scope.additional = {
        users: $scope.users
      }

      $scope.createGroup = function() {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.id,
          status: true
        });
      };

    }
  ]);
