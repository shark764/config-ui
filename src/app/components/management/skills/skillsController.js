'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$state', 'Session', 'Skill', 'skillTableConfig', 'BulkAction', 'DirtyForms',
    function($scope, $state, Session, Skill, skillTableConfig, BulkAction, DirtyForms) {

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
      
      $scope.createBulkActions = function () {
        $scope.bulkActions = {
          setStatus: new BulkAction()
        };
      };
      
    //Various navigation rules
      $scope.$on('table:on:click:create', function () {
        $scope.bulkActions = null;
        $scope.selectedSkill = new Skill({
          tenantId: Session.tenant.tenantId,
          status: true,
          hasProficiency: false,
          description: ''
        });
      });

      $scope.$on('table:resource:selected', function () {
        $scope.bulkActions = null;
      });

      $scope.$on('table:resource:checked', function () {
        if (!$scope.bulkActions) {
          DirtyForms.confirmIfDirty(function () {
            $scope.createBulkActions();
          });
        }
      });

      $scope.$on('table:on:click:actions', $scope.createBulkActions);

      $scope.$on('bulk:action:cancel', function () {
        $scope.createBulkActions();
      });

      $scope.fetch();
    }
  ]);
