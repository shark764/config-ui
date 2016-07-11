'use strict';

angular.module('liveopsConfigPanel')
  .service('capacityRulesTableConfig', ['statuses', '$translate', 'UserPermissions', 'helpDocsHostname', 'PermissionGroups',
    function(statuses, $translate, UserPermissions, helpDocsHostname, PermissionGroups) {
      var config = {
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'sref': 'content.management.capacityRules',
        'title': $translate.instant('capacityRules.table.title'),
        'helpLink': helpDocsHostname + '/Help/Content/Managing%20Users/Creating_Groups.htm',
        'showBulkActions': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_GROUPS');
        },
        'showCreate': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_GROUPS');
        }
      };

      config.fields = [{
        'header': {
          'display': $translate.instant('value.name')
        },
        'name': '$original.name'
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
        'name': '$original.active',
        'id': 'status-column-dropdown',
        'transclude': true,
      }];

      return config;
    }
  ]);
