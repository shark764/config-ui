'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$state', 'Session', 'Group', 'User', 'groupTableConfig', 'toastr',
    function ($scope, $state, Session, Group, User, groupTableConfig) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;

      $scope.$watch('Session.tenant', function () {
        $scope.fetch();
      });

      $scope.fetch = function () {
        $scope.groups = Group.query({
          tenantId: Session.tenant.tenantId
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
