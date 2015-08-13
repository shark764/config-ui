'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates', '$translate', 'Skill', 'Group', 'TenantRole', 'Session',
    function (userStatuses, userStates, $translate, Skill, Group, TenantRole, Session) {
      Skill.prototype.value = function () {
        return this.id;
      };
      
      Skill.prototype.display = function () {
        return this.name;
      };

      Group.prototype.value = function () {
        return this.id;
      };
      
      Group.prototype.display = function () {
        return this.name;
      };

      function getSkillOptions() {
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      function getGroupOptions() {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      function getRoleOptions() {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      }

      return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'resolve': function (user) {
            return user.$original.getDisplay();
          },
          'sortOn': '$original.lastName'
        }, {
          'header': {
            'display': $translate.instant('value.email')
          },
          'name': '$original.email'
        }, {
          'header': {
            'display': $translate.instant('details.externalId')
          },
          'name': '$original.externalId'
        }, {
          'header': {
            'display': $translate.instant('user.table.skills'),
            'valuePath': 'id',
            'displayPath': 'name',
            'options': getSkillOptions,
          },
          'lookup': 'skills:id',
          'resolve': function (user) {
            return user.skills.length;
          },
          'sortOn': 'skills.length',
          'filterOrderBy': 'name'
        }, {
          'header': {
            'display': $translate.instant('user.table.groups'),
            'valuePath': 'id',
            'displayPath': 'name',
            'options': getGroupOptions,
          },
          'lookup': 'groups:id',
          'resolve': function (user) {
            return user.groups.length;
          },
          'sortOn': 'groups.length',
          'filterOrderBy': 'name'
        }, {
          'header': {
            'display': $translate.instant('user.table.roles'),
            'valuePath': 'id',
            'displayPath': 'name',
            'options': getRoleOptions,
          },
          'name': '$original.roleName',
          'lookup': '$original:roleId',
          'sortOn': '$original.roleName',
          'filterOrderBy': 'name'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'options': userStatuses
          },
          'name': '$original.status',
          'transclude': true,
          'checked': false
        }],
        'searchOn': ['firstName', 'lastName', {
          path: '$original.skills',
          inner: {
            path: 'name'
          }
        }],
        'orderBy': '$original.lastName',
        'title': $translate.instant('user.table.title')
      };
    }
  ]);
