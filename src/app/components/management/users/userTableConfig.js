'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates', '$translate', 'Skill', 'Group', 'TenantRole', 'Session', 'UserPermissions',
    function (userStatuses, userStates, $translate, Skill, Group, TenantRole, Session, UserPermissions) {
      function getSkillOptions() {
        return Skill.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      }

      function getGroupOptions() {
        return Group.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      }

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
          'resolve': function (tenantUser) {
            return tenantUser.$user.$original.getDisplay();
          },
          'sortOn': '$user.$original.lastName'
        }, {
          'header': {
            'display': $translate.instant('value.email')
          },
          'name': '$user.$original.email'
        }, {
          'header': {
            'display': $translate.instant('details.externalId')
          },
          'name': '$user.$original.externalId'
        }, {
          'header': {
            'display': $translate.instant('user.table.skills'),
            'valuePath': 'id',
            'displayPath': 'name',
            'options': getSkillOptions,
          },
          'lookup': 'skills:id',
          'name': 'skills',
          'id': 'user-skills-table-column',
          'resolve': function (tenantUser) {
            return tenantUser.skills.length;
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
          'name': 'groups',
          'id': 'user-groups-table-column',
          'resolve': function (tenantUser) {
            return tenantUser.groups.length;
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
          'id': 'user-roles-table-column',
          'lookup': '$original:roleId',
          'sortOn': '$original.roleName',
          'filterOrderBy': 'name'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': userStatuses()
          },
          'name': '$original.status',
          'id': 'user-status-table-column',
          'transclude': true,
          'checked': false
        }],
        'searchOn': [{
          path: '$user.lastName'
        }, {
          path: '$user.firstName'
        }, {
          path: '$original.skills',
          inner: {
            path: 'name'
          }
        }],
        'orderBy': '$user.$original.lastName',
        'title': $translate.instant('user.table.title'),
        'showBulkActions': UserPermissions.hasPermission('PLATFORM_MANAGE_ALL_USERS'),
        'showCreate': UserPermissions.hasPermissionInList(['PLATFORM_CREATE_USERS', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_TENANT_ENROLLMENT'])
      };
    }
  ]);
