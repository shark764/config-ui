'use strict';

angular.module('liveopsConfigPanel')
  .service('capacityRulesTableConfig', ['statuses', '$translate', 'UserPermissions', '$rootScope',
    function(statuses, $translate, UserPermissions, $rootScope) {
      var config = {
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'sref': 'content.management.capacityRules',
        'title': $translate.instant('capacityRules.table.title'),
        'helpLink': $rootScope.helpURL + '/Help/Content/Managing%20Users/Capacity_Rules/Creating_Capacity_Rules.htm',
        'showBulkActions': function() {
          return false;
        },
        'showCreate': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_CAPACITY_RULES');
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

      $rootScope.$on( "updateHelpURL", function () {
      	config.helpLink = $rootScope.helpURL + '/Help/Content/Managing%20Users/Capacity_Rules/Creating_Capacity_Rules.htm';
      });

      return config;
    }
  ]);
