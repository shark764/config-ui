'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetSkills', [ 'Skill', 'Session',
    function (Skill, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/setSkillsBulkAction.html',
        link: function ($scope) {
          $scope.skillActions = [
            {
              action: 'add',
              label:'Add Skill'
            },
            {
              action: 'update',
              label:'Update Skill'
            },
            {
              action: 'remove',
              label:'Remove Skill'
            }
          ];
          var countSkills = 0;
          $scope.skillsToAdd = [];

          $scope.skills = Skill.query({
            tenantId: Session.tenant.tenantId
          });

          $scope.removeBulkSkill = function(item) {
            var index = $scope.skillsToAdd.indexOf(item);
            $scope.skillsToAdd.splice(index, 1);     
          }

          $scope.addBulkSkill = function() {
            $scope.skillsToAdd.push({id: countSkills});
            countSkills++;

            console.log($scope.skillsToAdd);
          }

          $scope.bulkAction.action = function(user) {
            console.log("Herro?");
            //user.skills = $scope.skills;
            console.log($scope.skillsToAdd);
            return user;
          }
        }
      };
    }
  ]);