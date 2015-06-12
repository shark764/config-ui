'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$state', 'Session', 'Group', 'User', 'groupTableConfig',
    function($scope, $state, Session, Group, User, groupTableConfig) {
      $scope.Session = Session;


      if(!Session.tenant.tenantId){
          $state.transitionTo('content.management.users');
          alert('No tenant set; redirect to management');
      }

      $scope.tableConfig = groupTableConfig;

      $scope.groups = Group.query({
        tenantId: Session.tenant.tenantId
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
          tenantId: Session.tenant.tenantId,
          status: true,
          owner: Session.user.id
        });
      };

    }
  ]);
