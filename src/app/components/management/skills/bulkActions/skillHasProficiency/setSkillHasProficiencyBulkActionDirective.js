'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkillHasProficiency', ['Skill', 'Session',
    function (Skill, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/skills/bulkActions/skillHasProficiency/setSkillHasProficiencyBulkAction.html',
        link: function ($scope) {
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
