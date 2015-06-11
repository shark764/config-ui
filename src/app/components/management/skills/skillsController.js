'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', 'Session', 'Skill', 'skillTableConfig',
    function($scope, Session, Skill, skillTableConfig) {
      $scope.Session = Session;

      $scope.tableConfig = skillTableConfig;

      $scope.skills = Skill.query( { tenantId: Session.tenant.id } );

      $scope.createSkill = function() {
        $scope.selectedSkill = new Skill( {
          tenantId: Session.tenant.id,
          status: true,
          hasProficiency: false
           } );
      };

    }
  ]);
