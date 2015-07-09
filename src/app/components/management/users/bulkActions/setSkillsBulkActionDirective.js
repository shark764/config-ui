'use strict';

angular.module('liveopsConfigPanel')
.directive('baUserSkills', [ '$q', 'userSkillsBulkActionTypes', 'Skill', 'Session', '$translate', 'TenantUserSkills',
  function ($q, userSkillsBulkActionTypes, Skill, Session, $translate, TenantUserSkills) {
    return {
      restrict: 'AE',
      scope: {
        bulkAction: '='
      },
      templateUrl: 'app/components/management/users/bulkActions/setSkillsBulkAction.html',
      link: function ($scope) {
        $scope.userSkillsBulkActionTypes = userSkillsBulkActionTypes;
        var countSkills = 0;
        $scope.userSkillsBulkActions = [{}];

        $scope.skills = Skill.query({
          tenantId: Session.tenant.tenantId
        });

        $scope.removeBulkSkill = function(item) {
          var index = $scope.userSkillsBulkActions.indexOf(item);
          $scope.userSkillsBulkActions.splice(index, 1);     
        }

        $scope.addBulkSkill = function() {
          $scope.userSkillsBulkActions.push({id: countSkills});
          countSkills++;
        }

        $scope.bulkAction.action = function (user) {
          var promises = [];
          angular.forEach($scope.userSkillsBulkActions, function(userSkillsBulkAction) {
            if(!userSkillsBulkAction.selectedSkill || !userSkillsBulkAction.selectedType) {
              return;
            }

            if(userSkillsBulkAction.selectedType === 'add') {
              var tenantUserSkill = new TenantUserSkills();

              tenantUserSkill.skillId = userSkillsBulkAction.selectedSkill.id;
              tenantUserSkill.proficiency = userSkillsBulkAction.selectedSkill.proficiency;

              promises.push(tenantUserSkill.$create({
                tenantId: Session.tenant.tenantId,
                userId: user.id
              }));

            } else if (userSkillsBulkAction.selectedType === 'remove') {

              var tenantUserSkill = new TenantUserSkills();

              promises.push(tenantUserSkill.$delete({
                skillId: userSkillsBulkAction.selectedSkill.id,
                tenantId: Session.tenant.tenantId,
                userId: user.id
              }));

            } else if (userSkillsBulkAction.selectedType ==='update') {

              var tenantUserSkill = new TenantUserSkills();
              tenantUserSkill.proficiency = userSkillsBulkAction.selectedSkill.proficiency;
              tenantUserSkill.userId = user.id;
              tenantUserSkill.tenantId = Session.tenant.tenantId;

              promises.push(tenantUserSkill.$update({
                skillId: userSkillsBulkAction.selectedSkill.id
              }));

            }
          });

          return $q.all(promises);
        };
      }
    };
  }
]);