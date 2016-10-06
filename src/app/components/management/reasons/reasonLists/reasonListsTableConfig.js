'use strict';

angular.module('liveopsConfigPanel')
  .service('reasonListsTableConfig', ['$translate', 'UserPermissions', 'helpDocsHostname', 'statuses', function($translate, UserPermissions, helpDocsHostname, statuses) {
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
          'display': $translate.instant('value.default'),
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
        'name': '$original.isDefault',
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
      'title' : $translate.instant('reasonLists.table.title'),
      'sref' : 'content.configuration.reasonLists',
      'showCreate': function () {
        return UserPermissions.hasPermission('CREATE_REASON_LIST');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('UPDATE_REASON_LIST');
      }
    };
  }]);
