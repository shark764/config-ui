'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$state', 'Session', 'Skill', 'skillTableConfig',
    function($scope, $state, Session, Skill, skillTableConfig) {

      $scope.Session = Session;

      $scope.tableConfig = skillTableConfig;

      $scope.$watch('Session.tenant.tenantId', function () {
        $scope.fetch();
      }, true);

      $scope.fetch = function() {
        $scope.skills = Skill.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.selectedSkill = new Skill({
          tenantId: Session.tenant.tenantId,
          status: true,
          hasProficiency: false,
          description: ''
        });
      });

      $scope.fetch();
    }
  ]);
