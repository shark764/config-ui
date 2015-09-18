'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaTableConfig', ['mediaTypes', '$translate', 'UserPermissions', function (mediaTypes, $translate, UserPermissions) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': '$original.name'
        }, {
          'header': {
            'display': $translate.instant('value.source')
          },
          'name': '$original.source'
        }, {
          'header': {
            'display': $translate.instant('value.type'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': mediaTypes
          },
          'name': '$original.type',
          'id': 'type-column-dropdown',
          'lookup': '$original:type',
          'filter': 'selectedOptions'
        }, {
          'header': {
            'display': $translate.instant('value.properties')
          },
          'name': '$original.properties'
        }],
        'searchOn' : ['$original.source', '$original.name'],
        'orderBy' : '$original.name',
        'title' : $translate.instant('media.table.title'),
        'showBulkActions': false,
        'showCreate': UserPermissions.hasPermission('MANAGE_ALL_MEDIA')
      };
    }]
  );
