'use strict';

angular.module('liveopsConfigPanel')
  .service('customStatsManagementTableConfig', ['$translate', 'UserPermissions', 'CustomDomain', function($translate, UserPermissions, CustomDomain) {

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
            'display': $translate.instant('value.details.activeVersion')
          },
          'name': 'activeVersion',
          'transclude': true,
          'sortOn': 'activeStat.name'
        }],
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'title': $translate.instant('customStat.table.title'),
        'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Reporting/Realtime/Realtime_Report_Types.htm'),
        'sref': 'content.reporting.custom-stats',
        'showBulkActions': false,
        'showCreate': function() {
          return UserPermissions.hasPermission('CUSTOM_STATS_CREATE');
        }
    };
  }]);
