'use strict';

angular.module('liveopsConfigPanel')
  .service('contactAttributesTableConfig', ['statuses', 'ynStatuses', '$translate', 'UserPermissions', function(statuses, ynStatuses, $translate, UserPermissions) {

    return {
      'fields': [{
        'header': {
          'display': $translate.instant('value.attribute')
        },
        'name': '$original.objectName'
      }, {
        'header': {
          'display': $translate.instant('value.label')
        },
        'name': '$original.label'
      }, {
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': '$original.type'
      }, {
        'header': {
          'display': $translate.instant('value.default')
        },
        'name': '$original.default'
      }, {
        'header': {
          'display': $translate.instant('value.mandatory'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': ynStatuses()
        },
        'name': '$original.mandatory',
        'transclude': true
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
      'orderBy': '$original.objectName',
      'title': $translate.instant('contactAttributes.table.title'),
      'sref': 'content.configuration.contactAttributes',
      'showCreate': function() {
        return UserPermissions.hasPermission('CONTACTS_ATTRIBUTES_CREATE');
      },
      'showBulkActions': function() {
        return UserPermissions.hasPermission('CONTACTS_ATTRIBUTES_UPDATE');
      }
      // 'helpLink': helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Integrations/Creating_Integrations.htm'
    };
  }]);
