'use strict';

angular.module('liveopsConfigPanel')
  .service('flowTableConfig', ['$translate', function ($translate) {
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
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : $translate.instant('flow.table.title')
      };
    }]
  );
