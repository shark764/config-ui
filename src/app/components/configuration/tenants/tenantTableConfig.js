'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['statuses', '$translate', 'Tenant', 'UserPermissions', 'CustomDomain', function(statuses, $translate, Tenant, UserPermissions, CustomDomain) {

    var CustomDomainSvc = new CustomDomain();

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
          'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Configuration/Creating_Tenants.htm'),
          'baseHelpLink': '/Help/Content/Configuration/Creating_Tenants.htm',
          'sref': 'content.configuration.tenants',
          'showBulkActions': function() {
            return UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS']);
          },
          'showCreate': function() {
            return UserPermissions.hasPermissionInList(['CREATE_CHILD_TENANT']);
          }
        };
      };
    }
  ]);
