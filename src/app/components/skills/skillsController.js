'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$location', '$routeParams', '$filter', 'Session', 'Skill', 'skillTableConfig',
    function($scope, $location, $routeParams, $filter, Session, Skill, skillTableConfig) {
      $scope.Session = Session;

      $scope.tableConfig = skillTableConfig;

      $scope.skills = Skill.query( { tenantId: Session.tenant.id } );

      console.log(Session);
      console.log($scope);


      $scope.createSkill = function() {
        $scope.selectedSkill = new Skill( { 
          tenantId: Session.tenant.id,
          status: true,
          hasProficiency: false
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
