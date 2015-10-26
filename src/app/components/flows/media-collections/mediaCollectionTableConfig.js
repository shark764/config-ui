'use strict';

angular.module('liveopsConfigPanel')
  .service('mediaCollectionTableConfig', ['$translate', 'UserPermissions', 'helpDocsHostname', function ($translate, UserPermissions, helpDocsHostname) {
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
            'display': $translate.instant('value.identifier')
          },
          'resolve': function(collection) {
            var identifiers = [];
            for (var i = 0; i < collection.$original.mediaMap.length; i++){
              identifiers.push(collection.$original.mediaMap[i].lookup);
            }

            return identifiers.join(', ');
          },
          'sortOn': '$original.mediaMap[0].lookup'
        }],
        'searchOn' : ['$original.name'],
        'orderBy' : '$original.name',
        'title' : $translate.instant('media.collections.table.title'),
        'showBulkActions': false,
        'showCreate': UserPermissions.hasPermission('MANAGE_ALL_MEDIA'),
        'helpLink' : helpDocsHostname + '/Content/Managing%20Flows/Media_collection.htm'
      };
    }
  ]);
