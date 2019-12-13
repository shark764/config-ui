'use strict';

angular.module('liveopsConfigPanel')
  .service('messageTemplatesTableConfig', ['statuses', '$translate', 'UserPermissions', 'CustomDomain', function(statuses, $translate, UserPermissions, CustomDomain) {

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
        'name': '$original.description',
        'optional': true
      }, {
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': '$original.type'
      }, {
        'header': {
          'display': $translate.instant('value.channels')
        },
        'name': '$original.channels',
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
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title': $translate.instant('messageTemplates.table.title'),
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Configuration/Messaging_Templates/Creating_Messaging_Templates.htm'),
      'sref': 'content.configuration.messageTemplatesOld',
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_MESSAGE_TEMPLATES');
      },
      'showBulkActions': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_MESSAGE_TEMPLATES');
      }
    };
  }]);
