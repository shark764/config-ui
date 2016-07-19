'use strict';

angular.module('liveopsConfigPanel')
  .service('dncListsTableConfig', ['statuses', '$translate', 'UserPermissions', 'helpDocsHostname', function(statuses, $translate, UserPermissions, helpDocsHostname) {
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
          'display': $translate.instant('dnc.table.expiration')
        },
        'name': '$original.expiration',
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
      'title' : $translate.instant('dnc.table.title'),
      'sref' : 'content.configuration.dnc',
      'showCreate': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'helpLink' : helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Business%20Hours/Business_Hours.htm'
    };
  }]);
