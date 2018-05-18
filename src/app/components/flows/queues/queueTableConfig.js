'use strict';

angular.module('liveopsConfigPanel')
  .service('queueTableConfig', ['statuses', '$translate', 'UserPermissions', 'CustomDomain', function(statuses, $translate, UserPermissions, CustomDomain) {

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
        'transclude': true,
        'name': '$original.activeQueue',
        'sortOn': '$original.activeQueue.name'
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': '$original.active',
        'id': 'status-column-dropdown',
        'lookup': '$original:active',
        'transclude': true,
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title': $translate.instant('queue.table.title'),
      'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Managing%20Flows/Create_queue.htm'),
      'sref': 'content.flows.queues',
      'showBulkActions': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_QUEUES');
      },
      'showCreate': function() {
        return UserPermissions.hasPermission('MANAGE_ALL_QUEUES');
      }
    };
  }]);
