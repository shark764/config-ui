'use strict';

angular.module('liveopsConfigPanel')
  .service('roleTableConfig', ['$translate', 'UserPermissions', 'CustomDomain', function($translate, UserPermissions, CustomDomain) {

      var CustomDomainSvc = new CustomDomain();

      return {
        'fields': [{
        'header': {
          'display': $translate.instant('value.name')
        },
        'name': '$original.name'
      }, {
        'header': {
          'display': $translate.instant('value.description')
        },
        'name': '$original.description'
      }, {
        'header': {
          'display': $translate.instant('role.table.permissions')
        },
        'resolve': function(tenantRole) {
          return tenantRole.$original.permissions.length;
        },
        'sortOn': '$original.permissions.length',
        'name': '$original.permissions'
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title': $translate.instant('role.table.title'),
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Managing%20Users/Adding_roles.htm'),
      'sref': 'content.management.roles',
      'showBulkActions': false,
      'showCreate': function() {
        return UserPermissions.hasPermissionInList(['PLATFORM_CREATE_TENANT_ROLES', 'MANAGE_ALL_ROLES']);
      }
    };
  }]);
