'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$state', 'Session', 'Skill', 'skillTableConfig', 'BulkAction',
    function($scope, $state, Session, Skill, skillTableConfig, BulkAction) {

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

    //Various navigation rules
      $scope.$on('table:on:click:create', function () {
        $scope.showBulkActions = false;

        $scope.selectedSkill = new Skill({
          tenantId: Session.tenant.tenantId,
          status: true,
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

      $scope.fetch();
      $scope.bulkActions = {
        setStatus: new BulkAction(),
        setHasProficiency: new BulkAction()
      };
    }
  ]);
