'use strict';

angular.module('liveopsConfigPanel')
  .service('hoursTableConfig', ['statuses', '$translate', 'UserPermissions', 'CustomDomain', function(statuses, $translate, UserPermissions, CustomDomain) {

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
          'display': $translate.instant('hours.timezone.header')
        },
        'name': '$original.timezone'
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
      'helpLink' : CustomDomainSvc.getHelpURL('/Help/Content/Configuration/Business%20Hours/Business_Hours.htm'),
      'baseHelpLink': '/Help/Content/Configuration/Business%20Hours/Business_Hours.htm',
      'sref' : 'content.configuration.hours',
      'showCreate': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      }
    };
  }]);
