'use strict';

angular.module('liveopsConfigPanel')
  .directive('userSkills', ['TenantUserSkills', 'Skill', 'Session', 'Alert', 'lodash',
    function(TenantUserSkills, Skill, Session, Alert, _) {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        templateUrl: 'app/components/management/users/userSkills/userSkills.html',
        link: function($scope) {
          $scope.selectedSkill = null;

          $scope.remove = function(tsu) {
            tsu.$delete({
              skillId: tsu.skillId
            }, function() {
              $scope.userSkills.removeItem(tsu);
            }, function() {
              Alert.error('Failed to remove skill');
            });
          };

          $scope.fetch = function() {
            $scope.saving = false;

            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.userSkills = TenantUserSkills.query({
                tenantId: Session.tenant.tenantId,
                userId: $scope.user.id
              },
              $scope.reset
            );
          };

          $scope.reset = function() {
            $scope.selectedSkill = null;
            if ($scope.skillsForm.name) {
              $scope.skillsForm.name.$setUntouched();
              $scope.skillsForm.name.$setPristine();
            }

            $scope.newUserSkill = new TenantUserSkills({
              skillId: null,
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            });
          };

          $scope.save = function() {
          if ($scope.selectedSkill === null){
            return;
          }

            $scope.saving = true;

            if (!$scope.selectedSkill.id) {
              new Skill({
                name: $scope.selectedSkill.name,
                hasProficiency: (typeof $scope.newUserSkill.proficiency === 'undefined' ? false : true),
                tenantId: Session.tenant.tenantId,
                description: '',
                status: true
              }).save(function(result) {
                $scope.selectedSkill = result;
                $scope.saveUserSkill();
              });
            } else {
              $scope.saveUserSkill();
            }
          };

          $scope.saveUserSkill = function() {
            $scope.newUserSkill.skillId = $scope.selectedSkill.id;

            if (!$scope.selectedSkill.hasProficiency) {
              delete $scope.newUserSkill.proficiency;
            } else if (!$scope.newUserSkill.proficiency) {
              $scope.newUserSkill.proficiency = 1;
            }

          var usc = angular.copy($scope.newUserSkill);
          usc.name = $scope.selectedSkill.name;

          var existing = _.find($scope.userSkills, { 'skillId' : usc.skillId });

            if (!existing) {
              $scope.userSkills.push(usc);
            } else {
              existing.proficiency = $scope.newUserSkill.proficiency;
            }

            $scope.newUserSkill.save(function() {
              $scope.reset();
              $scope.saving = false;
            }, function() {
              $scope.fetch();
              Alert.error('Failed to save user skill');
            });
          };

          $scope.$watch('user', function() {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.skills = Skill.query({
              tenantId: Session.tenant.tenantId
            }, $scope.fetch);
          });
        }
      };
    }
  ]);
