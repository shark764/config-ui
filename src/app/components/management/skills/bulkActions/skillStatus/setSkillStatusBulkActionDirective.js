'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkillStatus', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/skills/bulkActions/skillStatus/setSkillStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(skill) {
            var skillCopy = angular.copy(skill);
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
