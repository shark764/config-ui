'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', '$translate', 'UserPermissions', 'helpDocsHostname', function (statuses, $translate, UserPermissions, helpDocsHostname) {
    return {
      'fields': [{
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': '$original.type'
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': '$original.active',
        'id': 'status-column-dropdown',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['$original.type'],
      'orderBy': '$original.type',
      'title' : $translate.instant('integration.table.title'),
      'sref' : 'content.configuration.integrations',
      'showCreate': false,
      'showBulkActions': function () { return UserPermissions.hasPermission('MANAGE_ALL_PROVIDERS') },
      'helpLink' : helpDocsHostname + '/Content/Configuring%20CxEngage/Creating_Integrations.htm'
    };
  }]);
