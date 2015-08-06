'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', ['mediaTypes', '$translate', function (mediaTypes, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'name'
        }, {
          'header': $translate.instant('value.source'),
          'name': 'source'
        }, {
          'header': $translate.instant('value.type'),
          'name': 'type',
          'options': mediaTypes,
          'filter': 'selectedOptions'
        }, {
          'header': $translate.instant('value.properties'),
          'name': 'properties'
        }],
        'searchOn' : ['source', 'name'],
        'orderBy' : 'name',
        'title' : $translate.instant('media.table.title')
      };
    }]
  );
