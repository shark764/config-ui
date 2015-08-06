'use strict';

angular.module('liveopsConfigPanel')
  .service('queueTableConfig', ['statuses', '$translate', function (statuses, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'name'
        }, {
          'header': $translate.instant('value.description'),
          'name': 'description'
        }, {
          'header': $translate.instant('value.details.activeVersion'),
          'transclude': true,
          'name': 'activeVersion'
        }, {
          'header': $translate.instant('value.status'),
          'name': 'active',
          'transclude': true,
          'options': statuses()
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : $translate.instant('queue.table.title')
      };
    }
  ]);
