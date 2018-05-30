'use strict';

angular.module('liveopsConfigPanel')
  .service('capacityRulesTableConfig', ['statuses', '$translate', 'UserPermissions', 'CustomDomain', function(statuses, $translate, UserPermissions, CustomDomain) {

    var CustomDomainSvc = new CustomDomain();

    return {
      'fields': [{
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
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title': $translate.instant('capacityRules.table.title'),
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Managing%20Users/Capacity_Rules/Creating_Capacity_Rules.htm'),
      'sref': 'content.management.capacityRules',
      'showBulkActions': function() {
        return false;
      },
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_CAPACITY_RULES');
      }
    };
  }]);
