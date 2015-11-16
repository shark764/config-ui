'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['statuses', '$translate', 'Tenant', 'Session', 'UserPermissions', 'helpDocsHostname',
    function (statuses, $translate, Tenant, Session, UserPermissions, helpDocsHostname) {
      var fetchTenants = function fetchTenants() {
        return Tenant.cachedQuery({
          regionId: Session.activeRegionId
        });
      };

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
            'display': $translate.instant('tenant.details.parent'),
            'valuePath': 'id',
            'displayPath': 'name',
            'options': fetchTenants()
          },
          'name': 'parentId',
          'id': 'parent-column-dropdown',
          'lookup': '$original:parentId',
          'sortable': true,
          'transclude': true,
          'filter': 'selectedOptions'
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
        'title': $translate.instant('tenant.table.title'),
        'sref' : 'content.configuration.tenants',
        'showBulkActions': UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS', 'MANAGE_TENANT']),
        'showCreate': UserPermissions.hasPermission('PLATFORM_CREATE_ALL_TENANTS'),
        'helpLink': helpDocsHostname + '/Content/Configuring%20CxEngage/Creating_Tenants.htm'
      };
    }
  ]);
