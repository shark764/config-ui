'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates', '$translate', 'Skill', 'Group', 'TenantRole', 'Session', 'UserPermissions', 'queryCache',
    function (userStatuses, userStates, $translate, Skill, Group, TenantRole, Session, UserPermissions, queryCache) {
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
      
      this.getConfig = function() {
        var cached = queryCache.get('userTableConfig');
        if (cached){
          return cached;
        }
        
        var defaultConfig = {
          'fields' : [{
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
          }],
          'orderBy': '$user.$original.lastName',
          'title': $translate.instant('user.table.title'),
          'searchOn': [{
            path: '$user.lastName'
          }, {
            path: '$user.firstName'
          }, {
            path: '$original.skills',
            inner: {
              path: 'name'
            }
          }]
        };

        defaultConfig.showBulkActions = UserPermissions.hasPermission('PLATFORM_MANAGE_ALL_USERS');
        defaultConfig.showCreate = UserPermissions.hasPermissionInList(['PLATFORM_CREATE_USERS', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_TENANT_ENROLLMENT']);
        
        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_SKILLS', 'MANAGE_ALL_SKILLS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_TENANT_ENROLLMENT'])){
          defaultConfig.fields.push({
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
          });
        }
        
        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_GROUPS', 'MANAGE_ALL_GROUPS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_GROUP_OWNERS', 'MANAGE_TENANT_ENROLLMENT'])){
          defaultConfig.fields.push({
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
          });
        }
        
        if (UserPermissions.hasPermissionInList(['PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_ROLES', 'MANAGE_ALL_ROLES', 'MANAGE_TENANT_ENROLLMENT'])){
          defaultConfig.fields.push({
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
          });
        }
        
        defaultConfig.fields.push({
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
        });
        
        queryCache.put('userTableConfig', defaultConfig);
        return defaultConfig;
      }
    }
  ]);
