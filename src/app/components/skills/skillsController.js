'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$location', '$routeParams', '$filter', 'Session', 'Skill', 'skillTableConfig', 'userSidebarConfig',
    function($scope, $location, $routeParams, $filter, Session, Skill, skillTableConfig, userSidebarConfig) {
      $scope.Session = Session;

      $scope.tableConfig = skillTableConfig;

      $scope.skills = Skill.query( { tenantId: Session.tenant.id } );
      $scope.sidebarConfig = userSidebarConfig;

      console.log(Session);
      console.log($scope);


      $scope.createSkill = function() {
        $scope.selectedSkill = new Skill( {
          tenantId: Session.tenant.id,
          status: true,
          hasProficiency: false
           } );
      };

    }
  ]);
