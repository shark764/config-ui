'use strict';

angular.module('liveopsConfigPanel')
  .service('recordingsTableConfig', ['$translate', 'UserPermissions', 'helpDocsHostname', function ($translate, UserPermissions, helpDocsHostname) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('recordings.table.audio')
          },
          'name': 'play',
          'transclude': true
        }, {
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': '$original.name'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.timestamp')
          },
          'name': '$original.timestamp'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.resources')
          },
          'name': '$original.resources'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.emails')
          },
          'name': '$original.emails'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.extension')
          },
          'name': '$original.extension'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.flow')
          },
          'name': '$original.flow'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.callerani')
          },
          'name': '$original.callerani'
        }],
        'showSearch' : false,
        'orderBy' : '$original.name',
        'title' : $translate.instant('recordings.table.title'),
        'sref' : 'content.recordings.recording',
        'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_RECORDINGS'),
        'showCreate': false//,
        //'helpLink' : helpDocsHostname + '/Content/Managing%20Flows/Add_media.htm'
      };
    }]
  );
