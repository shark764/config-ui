'use strict';

angular.module('liveopsConfigPanel')
  .service('queueTableConfig', ['statuses', '$translate', function (statuses, $translate) {
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
          'name': '$original.activeVersion'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'name': '$original.active',
          'lookup': '$original:active',
          'transclude': true,
        }],
        'searchOn' : ['$original.name'],
        'orderBy' : '$original.name',
        'title' : $translate.instant('queue.table.title')
      };
    }
  ]);
