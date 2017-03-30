'use strict';

angular.module('liveopsConfigPanel')
  .directive('userSkills', ['TenantUserSkill', 'Skill', 'Session', 'Alert', '$translate', 'filterFilter', 'queryCache', 'TenantSkillUser', '$q',
    function (TenantUserSkill, Skill, Session, Alert, $translate, filterFilter, queryCache, TenantSkillUser, $q) {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        templateUrl: 'app/components/management/users/userSkills/userSkills.html',
        link: function ($scope, $element) {

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
              Alert.success($translate.instant('skill.details.remove.success'));

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
              Alert.error($translate.instant('skill.details.remove.fail'));
            });
          };

          $scope.reset = function () {
            $scope.saving = false;
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
            if (selectedSkill === null || selectedSkill === '') {
              return;
            }

            var promise;
            $scope.saving = true;

            if (angular.isString(selectedSkill)) {
              var skill = new Skill({
                name: selectedSkill,
                hasProficiency: (typeof $scope.newUserSkill.proficiency === 'undefined' ? false : true),
                tenantId: Session.tenant.tenantId,
                description: '',
                active: true
              });

              promise = skill.save(function (result) {
                $scope.saveUserSkill(result);
              }, function(response){
                $scope.saving = false;
                return $q.reject(response);
              });
            } else {
              promise = $scope.saveUserSkill(selectedSkill);
            }

            return promise;
          };

          $scope.saveUserSkill = function (selectedSkill) {
            $scope.newUserSkill.skillId = selectedSkill.id;

            if (!selectedSkill.hasProficiency) {
              delete $scope.newUserSkill.proficiency;
            } else if (!$scope.newUserSkill.proficiency) {
              $scope.newUserSkill.proficiency = 1;
            }

            return $scope.newUserSkill.save(function (tenantUserSkill) {
              $scope.userSkills.push(tenantUserSkill);
              $scope.user.$skills.push({
                id: tenantUserSkill.skillId,
                name: tenantUserSkill.name
              });

              $scope.reset();
            }, function (response) {
              $scope.saving = false;
              return $q.reject(response);
            });
          };

          $scope.$watch('user', function(){
            $scope.reset();
            $scope.fetchUserSkills();
          });

          $scope.updateUserSkill = function(userSkill){
            userSkill.id = userSkill.skillId;
            var newProficiency = userSkill.proficiency;

            userSkill.save().then(function(result){
              Alert.success($translate.instant('skill.details.update.success'));

              // @TODO: make this change in the TeantnUserControl model
              userSkill.proficiency = newProficiency;
              userSkill.$original.proficiency = newProficiency;

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
              Alert.error($translate.instant('skill.details.update.fail'));
            });
          };

          $scope.filterSkills = function(item) {
            var matchingSkills = filterFilter($scope.user.$skills, {
              'id': item.id
            }, true);

            return matchingSkills.length === 0;
          };

          $scope.onEnter = function(){
            //Trigger the lo-submit handler that is attached to the type-ahead
            //Normally they are only triggered by click, but it does support custom events
            $element.find('type-ahead').trigger('skills.enter.event');
          };
        }
      };
    }
  ]);
