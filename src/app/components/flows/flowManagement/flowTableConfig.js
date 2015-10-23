'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', ['$translate', 'statuses', 'UserPermissions', 'helpDocsHostname', function ($translate, statuses, UserPermissions, helpDocsHostname) {
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
            'display': $translate.instant('value.details.activeVersion')
          },
          'name': 'activeVersion',
          'transclude': true,
          'sortOn': 'activeFlow.name'
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
        'searchOn' : ['name'],
        'orderBy' : 'name',
        'title' : $translate.instant('flow.table.title'),
        'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_FLOWS'),
        'showCreate': UserPermissions.hasPermission('MANAGE_ALL_FLOWS'),
        'helpLink' : helpDocsHostname + '/Content/Managing%20Flows/Setup_flows.htm'
      };
    }]
  );
