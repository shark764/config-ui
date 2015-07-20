'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkillStatus', ['Skill', 'Session',
    function (Skill, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/skills/bulkActions/skillStatus/setSkillStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(skill) {
            var skillCopy = new Skill();
            skillCopy.id = skill.id;
            skillCopy.tenantId = Session.tenant.tenantId;
            skillCopy.status = $scope.status;
            return skillCopy.save().then(function(skillCopy) {
              angular.copy(skillCopy, skill);
              skill.checked = true;
              return skill;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.status = false;
          };
        }
      };
    }
  ]);
