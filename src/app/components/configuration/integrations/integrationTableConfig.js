'use strict';

angular.module('liveopsConfigPanel')
  .service('integrationTableConfig', ['statuses', '$translate', 'UserPermissions', '$rootScope', function(statuses, $translate, UserPermissions, $rootScope) {
    var defaultConfig = {
      'fields': [{
        'header': {
          'display': $translate.instant('value.type')
        },
        'name': '$original.type'
      }, {
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
      'searchOn': ['$original.type'],
      'orderBy': '$original.type',
      'title': $translate.instant('integration.table.title'),
      'sref': 'content.configuration.integrations',
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_PROVIDERS');
      },
      'showBulkActions': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_PROVIDERS');
      },
      'helpLink': $rootScope.helpURL + '/Help/Content/Configuration/Integrations/Creating_Integrations.htm'
    };
    $rootScope.$on( "updateHelpURL", function () {
    	defaultConfig.helpLink = $rootScope.helpURL + '/Help/Content/Configuration/Integrations/Creating_Integrations.htm';
    });

	   return defaultConfig;
  }]);
