'use strict';

angular.module('liveopsConfigPanel')
  .service('dispositionListsTableConfig', ['$translate', 'UserPermissions', 'statuses', 'CustomDomain', function($translate, UserPermissions, statuses, CustomDomain) {

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
          'display': $translate.instant('details.externalId')
        },
        'name': '$original.externalId'
      }, {
        'header': {
          'display': $translate.instant('value.shared'),
          'displayPath': 'display',
          'valuePath': 'value',
          'options': [
            {
              'display': $translate.instant('value.yes'),
              'displayKey': 'value.yes',
              'value': true
            },
            {
              'display': $translate.instant('value.no'),
              'displayKey': 'value.no',
              'value': false
            }
          ]
        },
        'name': '$original.shared',
        'id': 'shared-column-dropdown',
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
        'lookup': '$original:active',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title' : $translate.instant('dispositionLists.table.title'),
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Managing%20Flows/Dispositions/Creating_Disposition_Lists.htm'),
      'baseHelpLink': '/Help/Content/Managing%20Flows/Dispositions/Creating_Disposition_Lists.htm',
      'sref': 'content.flows.dispositionListsOld',
      'showCreate': function () {
        return UserPermissions.hasPermission('CREATE_DISPOSITION_LIST');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('UPDATE_DISPOSITION_LIST');
      }
    };
  }]);
