'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', ['$translate', 'statuses', function ($translate, statuses) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'name'
        }, {
          'header': $translate.instant('value.description'),
          'name': 'description'
        }, {
          'header': $translate.instant('value.details.activeVersion'),
          'name': 'activeVersion',
          'transclude': true
        }, {
          'header': $translate.instant('value.status'),
          'name': 'active',
          'sortable': true,
          'options': statuses(),
          'transclude': true,
          'filter': 'selectedOptions'
        }],
        'searchOn' : ['name'],
        'orderBy' : 'name',
        'title' : $translate.instant('flow.table.title')
      };
    }]
  );
