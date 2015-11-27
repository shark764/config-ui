'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkillStatus', ['Skill', 'Session', 'BulkAction',
    function (Skill, Session, BulkAction) {
      return {
        restrict: 'AE',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/skills/bulkActions/skillStatus/setSkillStatusBulkAction.html',
        link: function ($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          
          if(bulkActionExecutor){
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.bulkAction.apply = function(skill) {
            var skillCopy = new Skill();
            skillCopy.id = skill.id;
            skillCopy.tenantId = Session.tenant.tenantId;
            skillCopy.active = $scope.active;
            return skillCopy.save().then(function(skillCopy) {
              angular.copy(skillCopy, skill);
              skill.checked = true;
              return skill;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = '';
          };
        }
      };
    }
  ]);
