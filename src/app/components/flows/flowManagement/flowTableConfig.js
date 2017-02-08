'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', ['$translate', 'statuses', 'UserPermissions', 'helpDocsHostname', 'Flow',
    function($translate, statuses, UserPermissions, helpDocsHostname, Flow) {
      var flowSvc = new Flow();

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
        'dropDownUnderCreateBtn': $translate.instant('flow.createBtn.duplicateBtn'),
        'dropDownUnderCreateBtnHandler': flowSvc.cloneFlow,
        'showCreate': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_FLOWS');
        },
        'helpLink': helpDocsHostname + '/Help/Content/Managing%20Flows/Flow_overview.htm'
      };
    }
  ]);
