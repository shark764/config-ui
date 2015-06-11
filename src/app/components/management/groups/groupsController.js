'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', 'Session', 'Group', 'User', 'groupTableConfig',
    function($scope, Session, Group, User, groupTableConfig) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;

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
          owner: Session.id
        });
      };

    }
  ]);
