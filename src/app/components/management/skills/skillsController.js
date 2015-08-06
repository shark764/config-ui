'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$state', 'Session', 'Skill', 'skillTableConfig', 'BulkAction',
    function($scope, $state, Session, Skill, skillTableConfig, BulkAction) {

      $scope.Session = Session;

      $scope.tableConfig = skillTableConfig;

      $scope.fetchSkills = function() {
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      //Various navigation rules
      $scope.$on('table:on:click:create', function () {
        $scope.showBulkActions = false;

        $scope.selectedSkill = new Skill({
          tenantId: Session.tenant.tenantId,
          active: true,
          hasProficiency: false,
          description: ''
        });
      });

      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });

      $scope.bulkActions = {
        setStatus: new BulkAction(),
        setHasProficiency: new BulkAction()
      };
    }
  ]);
