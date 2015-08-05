'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', ['mediaTypes', '$translate', function (mediaTypes, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': '$original.name'
        }, {
          'header': $translate.instant('value.source'),
          'name': '$original.source'
        }, {
          'header': $translate.instant('value.type'),
          'name': '$original.type',
          'options': mediaTypes,
          'filter': 'selectedOptions'
        }, {
          'header': $translate.instant('value.properties'),
          'name': '$original.properties'
        }],
        'searchOn' : ['source', 'name'],
        'orderBy' : ['name'],
        'title' : $translate.instant('media.table.title')
      };
    }]
  );
