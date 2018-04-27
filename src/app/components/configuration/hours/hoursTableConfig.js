'use strict';

angular.module('liveopsConfigPanel')
  .service('hoursTableConfig', ['statuses', '$translate', 'UserPermissions', '$rootScope', function(statuses, $translate, UserPermissions, $rootScope) {
    var defaultConfig = {
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
      'sref' : 'content.configuration.hours',
      'showCreate': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'helpLink' : $rootScope.helpURL + '/Help/Content/Configuration/Business%20Hours/Business_Hours.htm'
    };

    $rootScope.$on( "updateHelpURL", function () {
    	defaultConfig.helpLink = $rootScope.helpURL + '/Help/Content/Configuration/Business%20Hours/Business_Hours.htm';
    });

    return defaultConfig;

  }]);
