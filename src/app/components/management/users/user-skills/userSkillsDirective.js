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

        $scope.remove = function (userSkill) {
          $scope.skillId = null;

          var tsu = new TenantUserSkills({
            memberId: userSkill.memberId,
            skillId: userSkill.skillId,
            tenantId: userSkill.tenantId
          });

          tsu.$delete(function () {
            $scope.fetch();
          });

        };

        $scope.add = function (skillId) {
          $scope.skillId = null;

          var tsu = new TenantUserSkills({
            userId: $scope.user.id,
            tenantId: Session.tenant.tenantId,
            skillId: skillId
          });

          tsu.$save(function () {
            $scope.fetch();
          });
        };

        $scope.fetch = function () {
          $scope.userSkills = TenantUserSkills.query({ tenantId: Session.tenant.tenantId, userId: $scope.user.id });
        };

        $scope.new = function() {
          if($scope.skills && $scope.filtered.length  > 0){
            $scope.skillId = $scope.filtered[0].id;
          }
        };

        $scope.$watch('user', function () {
          $scope.skillId = null;

          $scope.skills = Skill.query({ tenantId: Session.tenant.tenantId }, function () {
            $scope.fetch();
          });
        });
      }
    };
  }]);
