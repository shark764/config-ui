'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkillHasProficiency', ['Skill', 'Session', 'BulkAction',
    function(Skill, Session, BulkAction) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/skills/bulkActions/skillHasProficiency/setSkillHasProficiencyBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(skill) {
            var skillCopy = new Skill();
            skillCopy.id = skill.id;
            skillCopy.tenantId = Session.tenant.tenantId;
            skillCopy.hasProficiency = $scope.hasProficiency;
            return skillCopy.save().then(function(skillCopy) {
              angular.copy(skillCopy, skill);
              skill.checked = true;
              return skill;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.hasProficiency = 'true';
          };
        }
      };
    }
  ]);
