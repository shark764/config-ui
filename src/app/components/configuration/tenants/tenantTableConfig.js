'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantTableConfig', ['statuses', '$translate', function (statuses, $translate) {
    return {
      'fields': [{
        'header': $translate.instant('value.name'),
        'name': 'name'
      }, {
        'header': $translate.instant('value.description'),
        'name': 'description'
      }, {
        'header': $translate.instant('value.status'),
        'name': 'active',
        'sortable': true,
        'options': statuses(),
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['name'],
      'orderBy': 'name',
      'title' : $translate.instant('tenant.table.title')
    };
  }]);
