'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$location', '$routeParams', '$filter', 'Session', 'Group', 'groupTableConfig',
    function($scope, $location, $routeParams, $filter, Session, Group, groupTableConfig) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;

      $scope.groups = Group.query( { tenantId: Session.tenant.id } );

      $scope.createSkill = function() {
        $scope.selectedGroup = new Group( { 
          tenantId: Session.tenant.id,
          status: true
           } );
      };

    }
  ]);
