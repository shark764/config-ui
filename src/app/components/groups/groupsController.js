'use strict';

angular.module('liveopsConfigPanel')
  .controller('GroupsController', ['$scope', '$location', '$routeParams', '$filter', 'Session', 'Group', 'groupTableConfig',
    function($scope, $location, $routeParams, $filter, Session, Group, groupTableConfig) {
      $scope.Session = Session;

      $scope.tableConfig = groupTableConfig;

      $scope.groups = Group.query( { tenantId: Session.tenant.id } );

      $scope.createGroup = function() {
        $scope.selectedGroup = new Group( {
          tenantId: Session.tenant.id,
          status: true
           } );
      };


$scope.sidebarConfig = {
          title: 'Management',
          links: [{
            display: 'Users',
            link: '#/users',
            id: 'user-management-link'
          }, {
            display: 'Groups',
            link: '#/groups',
            id: 'group-management-link'
          }, {
            display: 'Skills',
            link: '#/skills',
            id: 'skill-management-link'
          }, {
            display: 'Roles',
            link: '#/',
            id: 'role-management-link'
          }]
      }
    }
  ]);
