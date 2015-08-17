'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', ['$translate', 'statuses', function ($translate, statuses) {
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
          'name': '$original.activeVersion',
          'transclude': true
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'name': '$original.active',
          'lookup': '$original:active',
          'sortable': true,
          'transclude': true,
          'filter': 'selectedOptions'
        }],
        'searchOn' : ['$original.name'],
        'orderBy' : '$original.name',
        'title' : $translate.instant('flow.table.title')
      };
    }]
  );
