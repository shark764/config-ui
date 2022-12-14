'use strict';

angular.module('liveopsConfigPanel')
  .service('UserSkillsBulkAction', ['userSkillsBulkActionTypes',
    function(userSkillsBulkActionTypes) {
      var UserSkillsBulkAction = function() {
        this.selectedType = userSkillsBulkActionTypes[0];
        this.usersAffected = [];
        this.params = {};
      };

      UserSkillsBulkAction.prototype.execute = function(user) {
        return this.selectedType.execute(user, this);
      };

      UserSkillsBulkAction.prototype.canExecute = function() {
        return this.selectedType.canExecute(this);
      };

      return UserSkillsBulkAction;
    }
  ])
  .service('userSkillsBulkActionTypes', ['$filter', 'hasSkill', 'Session', 'TenantUserSkill',
    function($filter, hasSkill, Session, TenantUserSkill) {
      return [{
        display: $filter('translate')('bulkActions.skills.add'),
        value: 'add',
        doesQualify: function(user, action) {
          var userSkill = hasSkill(user, action.params.skillId);
          if (userSkill) {
            return userSkill.proficiency !== action.params.proficiency;
          }
          return true;
        },
        execute: function(user, action) {
          var tenantUserSkill = new TenantUserSkill(action.params);

          return tenantUserSkill.$save({
            tenantId: Session.tenant.tenantId,
            userId: user.id
          }, function(userSkill) {
            user.$skills.push({
              id: userSkill.skillId,
              name: userSkill.name
            });
          });
        },
        canExecute: function(action) {
          return !!(action.selectedSkill &&
            action.selectedType);
        }
      }, {
        display: $filter('translate')('bulkActions.skills.update'),
        value: 'update',
        doesQualify: function(user, action) {
          var userSkill = hasSkill(user, action.params.skillId);
          if (userSkill) {
            return userSkill.proficiency !== action.params.proficiency;
          }
          return false;
        },
        execute: function(user, action) {
          var tenantUserSkill = new TenantUserSkill(action.params);

          return tenantUserSkill.$update({
            skillId: action.params.skillId,
            tenantId: Session.tenant.tenantId,
            userId: user.id
          });
        },
        canExecute: function(action) {
          return !!(action.params &&
            action.params.skillId &&
            angular.isDefined(action.params.proficiency));
        }
      }, {
        display: $filter('translate')('bulkActions.skills.remove'),
        value: 'remove',
        doesQualify: function(user, action) {
          return angular.isDefined(hasSkill(user, action.params.skillId));
        },
        execute: function(user, action) {
          var tenantUserSkill = new TenantUserSkill();

          return tenantUserSkill.$delete({
            skillId: action.params.skillId,
            tenantId: Session.tenant.tenantId,
            userId: user.id
          }, function() {
            for (var i = 0; i < user.$skills.length; i++) {
              if (user.$skills[i].id === action.params.skillId) {
                user.$skills.removeItem(user.$skills[i]);
                break;
              }
            }
          });
        },
        canExecute: function(action) {
          return !!(action.params &&
            action.params.skillId &&
            action.selectedType);
        }
      }];
    }
  ])
  .service('hasSkill', function() {
    return function(user, skillId) {
      var matchingSkill;
      angular.forEach(user.$skills, function(userSkill) {
        if (userSkill.id === skillId) {
          matchingSkill = userSkill;
        }
      });

      return matchingSkill;
    };
  });
