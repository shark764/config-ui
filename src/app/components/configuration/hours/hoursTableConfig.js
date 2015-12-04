'use strict';

angular.module('liveopsConfigPanel')
  .service('hoursTableConfig', ['statuses', '$translate', 'UserPermissions', 'helpDocsHostname', function (statuses, $translate, UserPermissions, helpDocsHostname) {
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
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title' : $translate.instant('hours.table.title'),
      'sref' : 'content.configuration.hours',
      'showCreate': true,
      'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS'),
      'helpLink' : helpDocsHostname + '/Content/Configuring%20CxEngage/Creating_Business_Hours.htm'
    };
  }]);
