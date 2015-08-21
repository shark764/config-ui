'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['statuses', '$translate', function (statuses, $translate) {
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
        'lookup': '$original:active',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['name'],
      'orderBy': 'name',
      'title' : $translate.instant('tenant.table.title')
    };
  }]);
