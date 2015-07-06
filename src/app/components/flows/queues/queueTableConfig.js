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
          'templateUrl': 'app/components/flows/queues/activeVersionName.html'
        }, {
          'header': $translate.instant('value.status'),
          'name': 'status',
          'templateUrl': 'app/shared/templates/statuses.html',
          'options': statuses()
        }],
        'searchOn' : ['name'],
        'orderBy' : ['name'],
        'title' : $translate.instant('queue.table.title')
      };
    }
  ]);
