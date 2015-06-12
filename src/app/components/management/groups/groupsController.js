'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$state', 'Session', 'Group', 'User', 'groupTableConfig', 'toastr',
    function($scope, $state, Session, Group, User, groupTableConfig) {
      $scope.Session = Session;

      $scope.redirectToInvites();

      $scope.tableConfig = groupTableConfig;

      $scope.groups = Group.query({
        tenantId: Session.tenant.tenantId
      }, function(data){
        if (! data.length){
          $scope.createGroup();
        }
      });

      $scope.createGroup = function() {
        $scope.selectedGroup = new Group({
          tenantId: Session.tenant.tenantId,
          status: true,
          owner: Session.user.id
        });
      };
    }
  ]);
