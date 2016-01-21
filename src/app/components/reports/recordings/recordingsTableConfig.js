'use strict';

angular.module('liveopsConfigPanel')
  .service('recordingsTableConfig', ['$translate', 'UserPermissions', 'helpDocsHostname',
    function ($translate, UserPermissions, helpDocsHostname) {
      return {
        'controls': {
          'transclude': true
        },
        'fields': [{
          'header': {
            'display': $translate.instant('value.id')
          },
          'name': 'id'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.datetime')
          },
          'name': '$interaction.startTime'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.flag')
          },
          'name': '$original.reviewNeeded'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.note')
          },
          'name': '$original.reviewReason'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.flow')
          },
          'name': '$interaction.flowId'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.callerani')
          },
          'name': '$interaction.customer'
        }],
        'showSearch': false,
        'orderBy': '$original.name',
        'title': $translate.instant('recordings.table.title'),
        'sref': 'content.recordings.recording',
        'showBulkActions': UserPermissions.hasPermission('MANAGE_ALL_RECORDINGS'),
        'showCreate': false //,
          //'helpLink' : helpDocsHostname + '/Content/Managing%20Flows/Add_media.htm'
      };
    }
  ]);