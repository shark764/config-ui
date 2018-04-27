'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', ['$translate', 'statuses', 'UserPermissions', '$rootScope',
    function($translate, statuses, UserPermissions, $rootScope) {

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
          'sortOn': 'activeFlow.name'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'name': 'active',
          'id': 'status-column-dropdown',
          'lookup': '$original:active',
          'sortable': true,
          'transclude': true,
          'filter': 'selectedOptions'
        }],
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'title': $translate.instant('flow.table.title'),
        'sref': 'content.flows.flowManagement',
        'showBulkActions': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_FLOWS');
        },
        'showCreate': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_FLOWS');
        },
        'helpLink': $rootScope.helpURL + '/Help/Content/Managing%20Flows/Flow_overview.htm'
      };

      $rootScope.$on( "updateHelpURL", function () {
      	defaultConfig.helpLink = $rootScope.helpURL + '/Help/Content/Managing%20Flows/Flow_overview.htm';
      });

      return defaultConfig;

    }
  ]);
