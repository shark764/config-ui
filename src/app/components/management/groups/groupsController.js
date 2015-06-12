'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$state', 'Session', 'Group', 'User', 'groupTableConfig', 'toastr',
    function($scope, $state, Session, Group, User, groupTableConfig) {
      $scope.Session = Session;

      $scope.redirectToInvites();

      $scope.tableConfig = groupTableConfig;


      $scope.fetch = function () {
        $scope.groups = Group.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant', function () {
        $scope.fetch();
      });

      $scope.createGroup = function() {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          status: true,
          owner: Session.user.id
        });
      };

      $scope.fetch();
    }
  ]);
