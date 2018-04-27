'use strict';

angular.module('liveopsConfigPanel')
  .service('roleTableConfig', ['$translate', 'UserPermissions', '$rootScope',
    function($translate, UserPermissions, $rootScope) {
      var defaultConfig = {
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
        'sref': 'content.management.roles',
        'showBulkActions': false,
        'showCreate': function() {
          return UserPermissions.hasPermissionInList(['PLATFORM_CREATE_TENANT_ROLES', 'MANAGE_ALL_ROLES']);
        },
        'helpLink': $rootScope.helpURL + '/Help/Content/Managing%20Users/Adding_roles.htm'
      };

      $rootScope.$on( "updateHelpURL", function () {
      	defaultConfig.helpLink = $rootScope.helpURL + '/Help/Content/Managing%20Users/Adding_roles.htm';
      });

      return defaultConfig;

    }
  ]);
