angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses','$q', 'userStates', '$translate', 'Skill', 'Group', 'TenantRole', 'Session', 'UserPermissions', 'tenantStatuses', 'queryCache', 'helpDocsHostname',
    function(userStatuses, $q, userStates, $translate, Skill, Group, TenantRole, Session, UserPermissions, tenantStatuses, queryCache, helpDocsHostname) {


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
        if (cached) {
          return cached;
        }

        var defaultConfig = {
          'fields': [{
            'header': {
              'display': $translate.instant('value.name')
            },
            'resolve': function(tenantUser) {
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
            'name': '$user.$original.externalId',
            'checked': false
          }],
          'orderBy': '$user.$original.lastName',
          'sref': 'content.management.users',
          'title': $translate.instant('user.table.title'),
          'helpLink': helpDocsHostname + '/Help/Content/Managing%20Users/Adding_users.htm',
          'searchOn': [{
            //Property order is significant, as it is the order that the fields get concat'd before being compared
            //So they should match the display order of "firstName lastName"
            path: '$user.firstName'
          }, {
            path: '$user.lastName'
          }, {
            path: '$user.email'
          }, {
            path: '$original.$skills',
            inner: {
              path: 'name'
            }
          }, {
            path: '$original.$groups',
            inner: {
              path: 'name'
            }
          }]
        };

        defaultConfig.showBulkActions = function() {
          return UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_USERS', 'MANAGE_TENANT_ENROLLMENT', 'MANAGE_ALL_USER_SKILLS', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT']);
        };

        defaultConfig.showCreate = function() {
          return UserPermissions.hasPermissionInList(['PLATFORM_CREATE_USERS', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_TENANT_ENROLLMENT']);
        };

        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_SKILLS', 'MANAGE_ALL_SKILLS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_TENANT_ENROLLMENT'])) {
        defaultConfig.fields.push({
          'header': {
            'display': $translate.instant('user.table.skills'),
            'valuePath': 'id',
            'displayPath': 'name',
            'options': getSkillOptions
          },
          'lookup': '$skills:id',
          'name': 'skills',
          'id': 'user-skills-table-column',
          'resolve': function(tenantUser) {
            if(typeof tenantUser.$original.$skills.length !== 'undefined' && tenantUser.$original.$skills.length === 0){
              if(!_.find(tenantUser.$skills, function(o) { return o.name == 'No Skill'; })){
                tenantUser.$skills.push(
                  {'id' : '123456',
                   'name':'No Skill',
                   'active': true,
                   'checked': true,
                   'hasProficiency': false,
                 'tenantId':Session.tenant.tenantId,
                 'description': ""}
               );
             }
             return 0;
           }else {
             return tenantUser.$skills.length;
           }

          },
          'sortOn': '$skills.length',
          'filterOrderBy': 'name'
        });
      }


        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_GROUPS', 'MANAGE_ALL_GROUPS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_GROUP_OWNERS', 'MANAGE_TENANT_ENROLLMENT'])) {
          defaultConfig.fields.push({
            'header': {
              'display': $translate.instant('user.table.groups'),
              'valuePath': 'id',
              'displayPath': 'name',
              'options': getGroupOptions
            },
            'lookup': '$groups:id',
            'name': '$groups',
            'id': 'user-groups-table-column',
            'resolve': function(tenantUser) {
              return tenantUser.$groups.length;
            },
            'sortOn': '$groups.length',
            'filterOrderBy': 'name'
          });
        }

        if (UserPermissions.hasPermissionInList(['PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_ROLES', 'MANAGE_ALL_ROLES', 'MANAGE_TENANT_ENROLLMENT'])) {
          defaultConfig.fields.push({
            'header': {
              'display': $translate.instant('user.table.roles'),
              'valuePath': 'id',
              'displayPath': 'name',
              'options': getRoleOptions
            },
            'name': '$original.$roleName',
            'id': 'user-roles-table-column',
            'lookup': '$original:roleId',
            'sortOn': '$original.$roleName',
            'filterOrderBy': 'name'
          });
        }

        defaultConfig.fields.push({
          'header': {
            'display': $translate.instant('value.presence'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': userStates
          },
          'name': '$original.state',
          'lookup': '$original:state',
          'id': 'user-presence-table-column',
          'transclude': true
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': userStatuses()
          },
          'name': '$original.$user.status',
          'lookup': '$original:$user:status',
          'id': 'user-status-table-column',
          'transclude': true,
          'checked': false
        }, {
          'header': {
            'display': $translate.instant('value.tenantStatus'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': tenantStatuses()
          },
          'name': '$original.status',
          'lookup': '$original:status',
          'id': 'tenant-status-table-column',
          'transclude': true
        });

        queryCache.put('userTableConfig', defaultConfig);
        return defaultConfig;
      };
    }
  ]);
