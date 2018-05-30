'use strict';

angular.module('liveopsConfigPanel')
  .service('transferListsTableConfig', ['$translate', 'UserPermissions', 'statuses', 'CustomDomain', function($translate, UserPermissions, statuses, CustomDomain) {

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
        'lookup': '$original:active',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title' : $translate.instant('transferLists.table.title'),
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Configuration/Transfer_Lists/Creating_Transfer_Lists.htm'),
      'sref': 'content.configuration.transferLists',
      'showCreate': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_TRANSFER_LISTS');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_TRANSFER_LISTS');
      }
    };
  }]);
