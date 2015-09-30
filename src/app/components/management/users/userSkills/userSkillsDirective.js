'use strict';

angular.module('liveopsConfigPanel')
  .directive('userSkills', ['TenantUserSkill', 'Skill', 'Session', 'Alert', 'filterFilter', '$translate',
    function (TenantUserSkill, Skill, Session, Alert, filterFilter, $translate) {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        templateUrl: 'app/components/management/users/userSkills/userSkills.html',
        link: function ($scope) {
          $scope.fetchSkills = function() {
            return Skill.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          };
          
          $scope.fetchUserSkills = function () {
            $scope.userSkills = TenantUserSkill.query({
                tenantId: Session.tenant.tenantId,
                userId: $scope.user.id
              });
          };

          $scope.remove = function (tsu) {
            tsu.$delete({
              skillId: tsu.skillId
            }, function () {
              Alert.success('Removed skill from user!');
              
              $scope.userSkills.removeItem(tsu);
              var userSkill = filterFilter($scope.user.skills, {
                'id': tsu.skillId
              }, true);
              
              if (userSkill.length){
                $scope.user.skills.removeItem(userSkill[0]);
              }
            }, function () {
              Alert.error('Failed to remove skill');
            });
          };

          $scope.reset = function () {
            $scope.selectedSkill = null;
            
            if ($scope.skillsForm.name) {
              $scope.skillsForm.name.$setUntouched();
              $scope.skillsForm.name.$setPristine();
            }

            $scope.newUserSkill = new TenantUserSkill({
              skillId: null,
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            });
          };

          $scope.save = function () {
            if ($scope.selectedSkill === null) {
              return;
            }

            $scope.saving = true;

            if (! $scope.selectedSkill.id) {
              new Skill({
                name: $scope.selectedSkill.name,
                hasProficiency: angular.isDefined($scope.newUserSkill.proficiency),
                tenantId: Session.tenant.tenantId,
                description: '',
                active: true
              }).save(function (result) {
                $scope.selectedSkill = result;
                $scope.saveUserSkill();
              });
            } else {
              $scope.saveUserSkill();
            }
          };

          $scope.saveUserSkill = function () {
            $scope.newUserSkill.skillId = $scope.selectedSkill.id;

            if (!$scope.selectedSkill.hasProficiency) {
              delete $scope.newUserSkill.proficiency;
            } else if (!$scope.newUserSkill.proficiency) {
              $scope.newUserSkill.proficiency = 1;
            }

            $scope.newUserSkill.save(function (tenantUserSkill) {
              $scope.userSkills.push(tenantUserSkill);
              $scope.user.skills.push({
                id: tenantUserSkill.skillId,
                name: tenantUserSkill.name
              });
              
              Alert.success('User skill added!');
              $scope.reset();
            }, function () {
              Alert.error('Failed to save user skill');
            }).finally(function(){
              $scope.saving = false;
            });
          };

          $scope.$watch('user', function(){
            $scope.reset();
            $scope.fetchUserSkills();
          });
          
          $scope.updateUserSkill = function(userSkill){
            userSkill.id = userSkill.skillId;
            userSkill.save().then(function(){
              Alert.success('User skill updated!');
            }, function(){
              Alert.error('Failed to update user skill');
            });
          };
          
          $scope.filterSkills = function(item) {
            var matchingSkills = filterFilter($scope.user.skills, {
              'id': item.id
            }, true);
            
            return matchingSkills.length === 0;
          };
        }
      };
    }
  ]);
