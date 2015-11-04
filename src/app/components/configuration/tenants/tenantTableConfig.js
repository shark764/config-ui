'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['statuses', '$translate', 'UserPermissions', 'helpDocsHostname',  function (statuses, $translate, UserPermissions, helpDocsHostname) {
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
          'display': $translate.instant('value.identifier')
        },
        'name': 'id',
        'checked': false
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
      'searchOn': ['name'],
      'orderBy': 'name',
      'title' : $translate.instant('tenant.table.title'),
      'showBulkActions': UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS', 'MANAGE_TENANT']),
      'showCreate': UserPermissions.hasPermission('PLATFORM_CREATE_ALL_TENANTS'),
      'helpLink' : helpDocsHostname + '/Content/Configuring%20CxEngage/Creating_Tenants.htm'
    };
  }]);
