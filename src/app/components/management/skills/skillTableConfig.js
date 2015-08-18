'use strict';

angular.module('liveopsConfigPanel')
  .service('skillTableConfig', ['statuses', '$translate',
    function (statuses, $translate) {
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
            'display': $translate.instant('skill.table.proficiency')
          },
          'transclude': true,
          'name': '$original.hasProficiency'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'filter': 'selectedOptions',
          'transclude': true,
          'name': '$original.active',
          'lookup': '$original:active'
        }],
        'searchOn' : ['$original.name', '$original.description'],
        'orderBy' : '$original.name',
        'title': $translate.instant('skill.table.title')
      };
    }
  ]);