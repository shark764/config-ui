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
          'name': '$interaction.endTimestamp | date: "medium"',
          'sortOn': '$interaction.endTimestamp',
          'format': 'time'
        }, {
        //   'header': {
        //     'display': $translate.instant('recordings.table.flag')
        //   },
        //   'name': '$original.reviewNeeded'
        // }, {
        //   'header': {
        //     'display': $translate.instant('recordings.table.note')
        //   },
        //   'name': '$original.reviewReason'
        // }, {
          'header': {
            'display': $translate.instant('recordings.table.flow')
          },
          'name': '$interaction.$flowName'
        }, {
          'header': {
            'display': $translate.instant('recordings.table.callerani')
          },
          'name': '$interaction.customer'
        }],
        'orderBy': '$interaction.startTime',
        'reverseSort': 'true',
        'showBulkActions': false,
        'showSearch': false,
        'showCreate': false
      };
    }
  ]);
