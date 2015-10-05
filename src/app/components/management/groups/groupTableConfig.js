'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', ['statuses', '$translate', 'UserPermissions',
    function (statuses, $translate, UserPermissions) {
      var config = {
        'searchOn' : ['name', 'description'],
        'orderBy' : 'name',
        'title' : $translate.instant('group.table.title'),
        'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_GROUPS'),
        'showCreate': UserPermissions.hasPermission('MANAGE_ALL_GROUPS')

      };
      
      config.fields = [{
        'header': {
          'display': $translate.instant('value.name')
        },
        'name': 'name'
      }, {
        'header': {
          'display': $translate.instant('value.description')
        },
        'name': 'description'
      }];
      
      if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_TENANT_ENROLLMENT'])){
        config.fields.push({
          'header': {
            'display': $translate.instant('group.table.members')
          },
          'name': 'members',
          'transclude': true,
          'sortOn': 'members.length'
        });
      }
      
      config.fields.push({
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': 'active',
        'id': 'status-column-dropdown',
        'transclude': true,          
      });
      
      return config;
    }
  ]);
