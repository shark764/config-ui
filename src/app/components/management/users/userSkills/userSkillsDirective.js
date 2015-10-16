'use strict';

angular.module('liveopsConfigPanel')
  .directive('userSkills', ['TenantUserSkill', 'Skill', 'Session', 'Alert', 'filterFilter', 'queryCache', 'TenantSkillUser',
    function (TenantUserSkill, Skill, Session, Alert, filterFilter, queryCache, TenantSkillUser) {
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
              var userSkill = filterFilter($scope.user.$skills, {
                'id': tsu.skillId
              }, true);
              
              if (userSkill.length){
                $scope.user.$skills.removeItem(userSkill[0]);
              }
              
              //TODO: remove once skills api returns members list
              //Reset cache of users for this skill
              queryCache.remove('skills/' + tsu.skillId + '/users');
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

          $scope.save = function (selectedSkill) {
            if (selectedSkill === null) {
              return;
            }

            $scope.saving = true;

            if (angular.isString(selectedSkill)) {
              new Skill({
                name: selectedSkill,
                hasProficiency: (typeof $scope.newUserSkill.proficiency === 'undefined' ? false : true),
                tenantId: Session.tenant.tenantId,
                description: '',
                active: true
              }).save(function (result) {
                $scope.saveUserSkill(result);
              });
            } else {
              $scope.saveUserSkill(selectedSkill);
            }
          };

          $scope.saveUserSkill = function (selectedSkill) {
            $scope.newUserSkill.skillId = selectedSkill.id;

            if (!selectedSkill.hasProficiency) {
              delete $scope.newUserSkill.proficiency;
            } else if (!$scope.newUserSkill.proficiency) {
              $scope.newUserSkill.proficiency = 1;
            }

            $scope.newUserSkill.save(function (tenantUserSkill) {
              $scope.userSkills.push(tenantUserSkill);
              $scope.user.$skills.push({
                id: tenantUserSkill.skillId,
                name: tenantUserSkill.name
              });
              
              Alert.success('User skill added!');
              
              //TODO: remove once skills api returns members list
              //Reset cache of users for this skill
              queryCache.remove('skills/' + selectedSkill.id + '/users');
              
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
            userSkill.save().then(function(result){
              Alert.success('User skill updated!');
              
              //Update cache for Skill Management page
              if (queryCache.get('skills/' + result.skillId + '/users')){
                var skillUsers = TenantSkillUser.cachedQuery({
                  tenantId: Session.tenant.tenantId,
                  skillId: result.skillId
                }, 'skills/' + result.skillId + '/users');
                
                var skillUser = filterFilter(skillUsers, {
                  userId: result.userId
                });
                
                if (skillUser.length){
                  skillUser[0].proficiency = result.proficiency;
                }
              }
              
              
            }, function(){
              Alert.error('Failed to update user skill');
            });
          };
          
          $scope.filterSkills = function(item) {
            var matchingSkills = filterFilter($scope.user.$skills, {
              'id': item.id
            }, true);
            
            return matchingSkills.length === 0;
          };
        }
      };
    }
  ]);
