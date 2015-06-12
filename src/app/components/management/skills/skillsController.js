'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$state', 'Session', 'Skill', 'skillTableConfig',
    function($scope, $state, Session, Skill, skillTableConfig) {

      $scope.Session = Session;

      if(!Session.tenant.tenantId){
        $state.transitionTo('content.management.users');
        alert('No tenant set; redirect to users');
      }

      $scope.tableConfig = skillTableConfig;

      $scope.skills = Skill.query( { tenantId: Session.tenant.tenantId } );

      $scope.createSkill = function() {
        $scope.selectedSkill = new Skill( {
          tenantId: Session.tenant.tenantId,
          status: true,
          hasProficiency: false
        } );
      };

    }
  ]);
