'use strict';

angular.module('liveopsConfigPanel')
  .service('contactLayoutsTableConfig', ['statuses', '$translate', 'UserPermissions', 'CustomDomain', function(statuses, $translate, UserPermissions, CustomDomain) {

    var CustomDomainSvc = new CustomDomain();

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
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Configuration/ContactLayouts.htm'),
      'sref': 'content.configuration.contactLayouts',
      'showCreate': function() {
        return UserPermissions.hasPermission('CONTACTS_LAYOUTS_CREATE');
      },
      'showBulkActions': false
    };
  }]);
