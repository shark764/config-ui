'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['statuses', '$translate', 'Tenant', 'UserPermissions', 'helpDocsHostname',
    function(statuses, $translate, Tenant, UserPermissions, helpDocsHostname) {
      return function(getTenants) {
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
              'display': $translate.instant('value.identifier')
            },
            'name': 'id',
            'checked': false
          }, {
            'header': {
              'display': $translate.instant('tenant.details.parent'),
              'valuePath': 'id',
              'displayPath': 'name',
              'options': getTenants()
            },
            'name': '$original.parent.name',
            'id': 'parent-column-dropdown',
            'lookup': '$original:parentId',
            'sortable': true,
            'filter': 'selectedOptions',
            'sortOn': 'parent.name'
          }, {
            'header': {
              'display': $translate.instant('value.status'),
              'valuePath': 'value',
              'displayPath': 'display',
              'options': statuses()
            },
            'name': 'active',
            'id': 'status-column-dropdown',
            'lookup': '$original:active',
            'sortable': true,
            'transclude': true,
            'filter': 'selectedOptions'
          }],
          'searchOn': ['$original.name'],
          'orderBy': '$original.name',
          'title': $translate.instant('tenant.table.title'),
          'sref': 'content.configuration.tenants',
          'showBulkActions': function() {
            return UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS', 'MANAGE_TENANT']);
          },
          'showCreate': function() {
            return UserPermissions.hasPermissionInList(['PLATFORM_CREATE_ALL_TENANTS', 'CREATE_CHILD_TENANT']);
          },
          'helpLink': helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Creating_Tenants.htm'
        };
      };
    }
  ]);
