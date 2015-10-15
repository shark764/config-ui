'use strict';

angular.module('liveopsConfigPanel')
  .controller('SkillsController', ['$scope', '$state', 'Session', 'Skill', 'skillTableConfig', 'BulkAction', 'TenantSkillUser', 'TenantUserSkill', 'Alert', 'TenantUser', 'queryCache', '$filter',
    function($scope, $state, Session, Skill, skillTableConfig, BulkAction, TenantSkillUser, TenantUserSkill, Alert, TenantUser, queryCache, $filter) {

      $scope.Session = Session;

      $scope.tableConfig = skillTableConfig;

      $scope.fetchSkills = function() {
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      //This is really awful and hopefully the API will update to accommodate this.
      Skill.prototype.fetchSkillUsers = function () {
        var result = TenantSkillUser.cachedQuery({
          tenantId: Session.tenant.tenantId,
          skillId: this.id
        }, 'skills/' + this.id + '/users');
        
        this.members = result;
        return result;
      };

      //Various navigation rules
      $scope.$on('table:on:click:create', function () {
        $scope.selectedSkill = new Skill({
          tenantId: Session.tenant.tenantId,
          active: true,
          hasProficiency: false,
          description: ''
        });
      });

      $scope.bulkActions = {
        setStatus: new BulkAction(),
        setHasProficiency: new BulkAction()
      };
      
      $scope.submit = function(){
        return $scope.selectedSkill.save();
      };
      
      $scope.removeUser = function(skillUser){
        var tenantUserSkill = new TenantUserSkill({
          id: $scope.selectedSkill.id,
          tenantId: skillUser.tenantId,
          userId: skillUser.userId
        });
        
        tenantUserSkill.$delete().then(function(){
          Alert.success('Removed this skill from user');
          
          //Clean up caches
          $scope.selectedSkill.fetchSkillUsers().removeItem(skillUser);
          
          if (queryCache.get(TenantUser.prototype.resourceName)){
            var tenantUser = TenantUser.cachedGet({id: skillUser.userId, tenantId: skillUser.tenantId});
            var userSkill = $filter('filter')(tenantUser.skills, {id: $scope.selectedSkill.id});
            if (userSkill.length > 0){
              tenantUser.skills.removeItem(userSkill[0]);
            }
          }
        }, function(){
          Alert.error('Failed to remove this skill from the user!');
        });
      };
    }
  ]);
