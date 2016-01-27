'use strict';

angular.module('liveopsConfigPanel')
  .service('recordingsTableConfig', ['$translate',
    function ($translate) {
      return {
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
        'orderBy': '$original.name',
        'sref': 'content.recordings.recording',
        'showBulkActions': false,
        'showSearch': false,
        'showCreate': false
      };
    }
  ]);