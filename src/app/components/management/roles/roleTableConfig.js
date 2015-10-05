'use strict';

angular.module('liveopsConfigPanel')
  .service('roleTableConfig', ['$translate', 'UserPermissions', function ($translate, UserPermissions) {
    //TODO: enable when API returns list of permissions object instead of just ids
    //function getPermissionOptions() {
    //  return TenantPermission.cachedQuery({
    //    tenantId: Session.tenant.tenantId
    //  });
    //}
    
     return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': 'name'
        }, {
          'header': {
            'display': $translate.instant('value.description')
          },
          'name': 'description'
        }, {
          'header': {
            'display': $translate.instant('role.table.permissions')//,
            //TODO: enable when API returns list of permissions object instead of just ids
            //'valuePath': 'id',
            //'displayPath': 'name',
            //'options': getPermissionOptions
          },
          //'lookup': 'permissions:id',
          'resolve': function (tenantRole) {
            return tenantRole.permissions.length;
          },
          'sortOn': 'permissions.length',
          'name': 'permissions'
        }],
        'searchOn' : ['name'],
        'orderBy' : 'name',
        'title': $translate.instant('role.table.title'),
        'showBulkActions': false,
        'showCreate': UserPermissions.hasPermissionInList(['PLATFORM_CREATE_TENANT_ROLES', 'MANAGE_ALL_ROLES'])
      };
    }
  ]);