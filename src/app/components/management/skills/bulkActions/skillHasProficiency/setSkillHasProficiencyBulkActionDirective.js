'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkillHasProficiency', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/skills/bulkActions/skillHasProficiency/setSkillHasProficiencyBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(skill) {
            var skillCopy = angular.copy(skill);
            skillCopy.hasProficiency = $scope.hasProficiency;
            return skillCopy.save().then(function(skillCopy) {
              angular.copy(skillCopy, skill);
              skill.checked = true;
              return skill;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.hasProficiency = false;
          };
        }
      };
    }
  ]);
