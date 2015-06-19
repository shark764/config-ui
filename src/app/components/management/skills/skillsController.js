'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$state', 'Session', 'Skill', 'skillTableConfig',
    function($scope, $state, Session, Skill, skillTableConfig) {

      $scope.Session = Session;

      $scope.redirectToInvites();

      $scope.tableConfig = skillTableConfig;

      $scope.$watch('Session.tenant', function () {
        $scope.fetch();
      });

      $scope.fetch = function(){
        $scope.skills = Skill.query( { tenantId: Session.tenant.tenantId } );
      };

      $scope.createSkill = function() {
        $scope.selectedSkill = new Skill( {
          tenantId: Session.tenant.tenantId,
          status: true,
          hasProficiency: false,
          description: ''
        } );
      };

      $scope.fetch();
    }
  ]);
