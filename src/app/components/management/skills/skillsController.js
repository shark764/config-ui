'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', 'Session', 'Skill', 'skillTableConfig', 'TenantSkillUser', 'TenantUserSkill', 'Alert', 'TenantUser', 'queryCache', '$filter', '$translate', 'loEvents',
    function($scope, Session, Skill, skillTableConfig, TenantSkillUser, TenantUserSkill, Alert, TenantUser, queryCache, $filter, $translate, loEvents) {

      $scope.Session = Session;
      $scope.tableConfig = skillTableConfig;
      $scope.params = {};
      $scope.forms = {};

      $scope.fetchSkills = function() {
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchTenantUsers = function() {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      //This is really awful and hopefully the API will update to accommodate this.
      Skill.prototype.fetchSkillUsers = function() {
        if (this.isNew()) {
          return [];
        }

        var result = TenantSkillUser.cachedQuery({
          tenantId: Session.tenant.tenantId,
          skillId: this.id
        }, 'skills/' + this.id + '/users');

        this.$members = result;
        return result;
      };

      //Various navigation rules
      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.selectedSkill = new Skill({
          tenantId: Session.tenant.tenantId,
          active: true,
          hasProficiency: false,
          description: ''
        });
      });

      $scope.submit = function() {
        return $scope.selectedSkill.save();
      };

      $scope.removeUser = function(skillUser) {
        var tenantUserSkill = new TenantUserSkill({
          id: skillUser.skillId,
          tenantId: skillUser.tenantId,
          userId: skillUser.userId
        });

        tenantUserSkill.$delete().then(function(){
          Alert.success($translate.instant('skill.details.remove.success'));

          //Clean up caches
          $scope.selectedSkill.fetchSkillUsers().removeItem(skillUser);

          if (queryCache.get(TenantUser.prototype.resourceName)) {
            var tenantUser = TenantUser.cachedGet({
              id: skillUser.userId,
              tenantId: skillUser.tenantId
            });
            var userSkill = $filter('filter')(tenantUser.$skills, {
              id: $scope.selectedSkill.id
            });
            if (userSkill.length > 0) {
              tenantUser.$skills.removeItem(userSkill[0]);
            }
          }
        }, function(){
          Alert.error($translate.instant('skill.details.remove.fail'));
        });
      };

      $scope.addUser = function(selectedUser) {
        if (selectedUser === null || angular.isString(selectedUser)) {
          return;
        }

        $scope.saving = true;

        var tenantUserSkill = new TenantUserSkill({
          skillId: $scope.selectedSkill.id,
          tenantId: Session.tenant.tenantId,
          userId: selectedUser.id
        });

        if ($scope.selectedSkill.hasProficiency) {
          tenantUserSkill.proficiency = $scope.params.proficiency;
        }

        tenantUserSkill.save(function(result) {
          $scope.saving = false;
          Alert.success($translate.instant('skill.details.add.success'));

          //Add to caches
          var tenantSkillUser = new TenantSkillUser({
            skillId: result.skillId,
            tenantId: result.tenantId,
            userId: result.userId,
            proficiency: result.proficiency
          });
          $scope.selectedSkill.fetchSkillUsers().push(tenantSkillUser);

          if (queryCache.get(TenantUser.prototype.resourceName)) {
            var tenantUser = TenantUser.cachedGet({
              id: result.userId,
              tenantId: result.tenantId
            });
            tenantUser.$skills.push(tenantUserSkill);
          }

          $scope.resetAddUser();

        }, function(){
          Alert.error($translate.instant('skill.details.add.fail'));
          $scope.saving = false;
        });
      };

      $scope.resetAddUser = function() {
        $scope.params.proficiency = 1;
        $scope.typeahead.selectedUser = null;
      };

      $scope.filterUsers = function(item) {
        if ($scope.selectedSkill) {
          var matchingUsers = $filter('filter')($scope.selectedSkill.fetchSkillUsers(), {
            'userId': item.id
          }, true);

          return matchingUsers.length === 0;
        }
      };
      
      $scope.updateActive = function(newVal){
        var skillCopy = new Skill({
          id: $scope.selectedSkill.id,
          tenantId: $scope.selectedSkill.tenantId,
          active: ! $scope.selectedSkill.active
        });
        
        return skillCopy.save(function(result){
          $scope.selectedSkill.$original.active = result.active;
        });
      };

      $scope.typeahead = {};
      $scope.resetAddUser();
    }
  ]);
