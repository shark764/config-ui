'use strict';

angular.module('liveopsConfigPanel')
  .service('UserSkillsBulkAction', ['userSkillsBulkActionTypes',
    function (userSkillsBulkActionTypes) {
      var UserSkillsBulkAction = function () {
        this.selectedType = userSkillsBulkActionTypes[0];
        this.usersAffected = [];
        this.params = {};
      };

      UserSkillsBulkAction.prototype.execute = function (user) {
        return this.selectedType.execute(user, this);
      };

      UserSkillsBulkAction.prototype.canExecute = function () {
        return this.selectedType.canExecute(this);
      };

      return UserSkillsBulkAction;
    }
  ])
  .service('userSkillsBulkActionTypes', ['$filter', 'hasSkill', 'Session', 'TenantUserSkills',
    function ($filter, hasSkill, Session, TenantUserSkills) {
      return [{
        display: $filter('translate')('bulkActions.skills.add'),
        doesQualify: function (user, action) {
          var userSkill = hasSkill(user, action.selectedSkill.users);
          if (userSkill) {
            return userSkill.proficiency !== action.params.proficiency;
          }
          return true;
        },
        execute: function (user, action) {
          var tenantUserSkill = new TenantUserSkills(action.params);

          return tenantUserSkill.$create({
            tenantId: Session.tenant.tenantId,
            userId: user.id
          });
        },
        canExecute: function (action) {
          return !!(action.selectedSkill &&
            action.selectedType);
        }
      }, {
        display: $filter('translate')('bulkActions.skills.update'),
        doesQualify: function (user, action) {
          var userSkill = hasSkill(user, action.selectedSkill.users);
          if (userSkill) {
            return userSkill.proficiency !== action.params.proficiency;
          }
          return false;
        },
        execute: function (user, action) {
          var tenantUserSkill = new TenantUserSkills(action.params);

          return tenantUserSkill.$update({
            skillId: action.params.skillId,
            tenantId: Session.tenant.tenantId,
            userId: user.id
          });
        },
        canExecute: function (action) {
          return !!(action.params &&
            action.params.skillId &&
            angular.isDefined(action.params.proficiency
          ));
        }
      }, {
        display: $filter('translate')('bulkActions.skills.remove'),
        doesQualify: function (user, action) {
          return angular.isDefined(hasSkill(user, action.selectedSkill.users));
        },
        execute: function (user, action) {
          var tenantUserSkill = new TenantUserSkills();

          return tenantUserSkill.$delete({
            skillId: action.params.skillId,
            tenantId: Session.tenant.tenantId,
            userId: user.id
          });
        },
        canExecute: function (action) {
          return !!(action.params &&
            action.params.skillId &&
            action.selectedType);
        }
      }];
    }
  ])
  .service('hasSkill', function () {
    return function (user, skillUsers) {
      var thisSkillUser;
      angular.forEach(skillUsers, function (userSkill) {
        if (userSkill.userId === user.id) {
          thisSkillUser = userSkill;
        }
      });

      return thisSkillUser;
    };
  });
