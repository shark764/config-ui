'use strict';

angular.module('liveopsConfigPanel')
  .directive('userSkills', ['TenantUserSkills', 'Skill', 'Session', function (TenantUserSkills, Skill, Session) {
    return {
      restrict: 'E',

      scope: {
        user: '='
      },

      templateUrl: 'app/components/management/users/user-skills/userSkills.html',

      link: function ($scope) {

        $scope.remove = function (tsu) {
          tsu.$delete({skillId: tsu.skillId}, $scope.fetch);
        };

        $scope.save = function (tsu) {
          if(tsu.added){
            tsu.save({skillId: tsu.skillId}, $scope.fetch);
          } else {
            tsu.save($scope.fetch);
          }
        };

        $scope.fetch = function () {
          $scope.newSkill = null;
          $scope.userSkills = TenantUserSkills.query({ tenantId: Session.tenant.tenantId, userId: $scope.user.id });
        };

        $scope.new = function() {
          $scope.newSkill = new TenantUserSkills({
            skillId: $scope.filtered[0].id,
            tenantId: Session.tenant.tenantId,
            userId: $scope.user.id
          });

        };

        $scope.$watch('user', function () {
          $scope.skills = Skill.query({ tenantId: Session.tenant.tenantId }, $scope.fetch);
        });
      }
    };
  }]);
