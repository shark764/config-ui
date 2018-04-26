'use strict';

angular.module('liveopsConfigPanel')
  .service('customStatsManagementTableConfig', ['$translate', '$rootScope', 'UserPermissions',
    function($translate, $rootScope, UserPermissions) {
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
            'display': $translate.instant('value.details.activeVersion')
          },
          'name': 'activeVersion',
          'transclude': true,
          'sortOn': 'activeStat.name'
        }],
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'helpLink': $rootScope.helpURL + '/Help/Content/Reporting/Realtime/Realtime_Report_Types.htm',
        'title': $translate.instant('customStat.table.title'),
        'sref': 'content.reporting.custom-stats',
        'showBulkActions': false,
        'showCreate': function() {
          return UserPermissions.hasPermission('CUSTOM_STATS_CREATE');
        }
      };

      $rootScope.$on( "updateHelpURL", function () {
      	defaultConfig.helpLink = $rootScope.helpURL + '/Help/Content/Reporting/Realtime/Realtime_Report_Types.htm';
      });

      return defaultConfig;

    }
  ]);
