'use strict';

angular.module('liveopsConfigPanel')
  .service('contactLayoutsTableConfig', ['statuses', '$translate', function(statuses, $translate) {

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
      'searchOn': ['$original.objectName'],
      'orderBy': '$original.active',
      'reverseSort': true,
      'title': $translate.instant('contactLayouts.table.title'),
      'sref': 'content.configuration.contactLayouts',
      'showCreate': function() {
        return true;
        // return UserPermissions.hasPermission('MANAGE_ALL_CONTACT_LAYOUTS');
      },
      'showBulkActions': false
      // 'helpLink': helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Integrations/Creating_Integrations.htm'
    };
  }]);
