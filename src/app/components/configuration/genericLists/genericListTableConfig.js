'use strict';

angular.module('liveopsConfigPanel')
  .service('genericListTableConfig', ['$translate', 'statuses', 'helpDocsHostname',
    function($translate, statuses, helpDocsHostname) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': 'name'
        }, {
          'header': {
            'display': $translate.instant('value.description')
          },
          'name': 'description'
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
        'searchOn': ['name'],
        'helpLink' : helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Lists/Lists.htm',
        'orderBy': 'name',
        'title': $translate.instant('list.table.title'),
        'showCreate': false,
        'showBulkActions': false,
        'sref': 'content.configuration.genericLists'
      };
    }
  ]);
