'use strict';

angular.module('liveopsConfigPanel')
  .directive('userSkills', ['TenantUserSkills', 'Skill', 'Session', 'toastr', 'lodash',
    function (TenantUserSkills, Skill, Session, toastr, _) {
    return {
      restrict: 'E',

      scope: {
        user: '='
      },

      templateUrl: 'app/components/management/users/user-skills/userSkills.html',

      link: function ($scope) {

        $scope.selectedSkill = null;

        $scope.remove = function (tsu) {

          var index = $scope.userSkills.indexOf(tsu);

          $scope.userSkills.splice(index, 1);

          tsu.$delete({skillId: tsu.skillId}, null, function() {
            $scope.fetch();
            toastr.error('Failed to remove skill');
          });
        };

        $scope.fetch = function () {
          $scope.saving = false;

          $scope.userSkills = TenantUserSkills.query(
            { tenantId: Session.tenant.tenantId, userId: $scope.user.id },
            $scope.new
          );
        };

        $scope.new = function() {
          $scope.selectedSkill = null;
          $scope.skillsForm.name.$touched = false;

          $scope.newUserSkill = new TenantUserSkills({
            skillId: null,
            tenantId: Session.tenant.tenantId,
            userId: $scope.user.id,
            proficiency: 0
          });
        };

        $scope.save = function () {
          $scope.saving = true;

          if(!$scope.selectedSkill.id){
            new Skill({
              name: $scope.selectedSkill.name,
              hasProficiency: true,
              tenantId: Session.tenant.tenantId,
              description: '',
              status: true
            }).save(function(result){
              $scope.selectedSkill = result;
              $scope.saveUserSkill();
            });

            return;
          }

          $scope.saveUserSkill();
        };

        $scope.saveUserSkill = function () {
          $scope.newUserSkill.skillId = $scope.selectedSkill.id;

          var usc = angular.copy($scope.newUserSkill);
          usc.name = $scope.selectedSkill.name;

          if(!$scope.selectedSkill.hasProficiency){
            $scope.newUserSkill.proficiency = 0;
          }

          var existing = _.find($scope.userSkills, { 'skillId' : usc.skillId });

          if(!existing){
            $scope.userSkills.push(usc);
          } else {
            existing.proficiency = $scope.newUserSkill.proficiency;
          }

          $scope.newUserSkill.save(function(){
            $scope.new();
            $scope.saving = false;
          }, function () {
            $scope.fetch();
            toastr.error('Failed to save user skill');
          });
        };

        $scope.$watch('user', function () {
          $scope.skills = Skill.query({ tenantId: Session.tenant.tenantId }, $scope.fetch);
        });
      }
    };
  }]);
