'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', '$translate', 'UserPermissions', 'CustomDomain', function(statuses, $translate, UserPermissions, CustomDomain) {

    var CustomDomainSvc = new CustomDomain();

    return {
      'fields': [{
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': '$original.type'
      }, {
        'header': {
          'display': $translate.instant('value.name')
        },
        'name': '$original.name'
      }, {
        'header': {
          'display': $translate.instant('value.description')
        },
        'name': '$original.description',
        'optional': true
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
      'title': $translate.instant('integration.table.title'),
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Configuration/Integrations/Creating_Integrations.htm'),
      'baseHelpLink': '/Help/Content/Configuration/Integrations/Creating_Integrations.htm',
      'sref': 'content.configuration.integrations',
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_PROVIDERS');
      },
      'showBulkActions': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_PROVIDERS');
      }
    };
  }]);
