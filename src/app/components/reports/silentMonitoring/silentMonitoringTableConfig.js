'use strict';

angular.module('liveopsConfigPanel')
  .service('silentMonitoringTableConfig', ['$translate',
    function ($translate) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('silentMonitoring.table.interactionId')
          },
          'name': 'interactionId'
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.agents')
          },
          'name': 'activeParticipants'
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.customerIdentification')
          },
          'name': 'customer'
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.contactPoint')
          },
          'name': 'contactPoint',
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.flow')
          },
          'name': 'flowId'
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.channel')
          },
          'name': 'channelType',
          'checked': false
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.direction')
          },
          'name': 'direction'
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.presenceState')
          },
          'name': 'state',
          'checked': false
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.startDate')
          },
          'name': 'conversationStartTimestamp | date:"mediumDate"',
          'sortOn': 'conversationStartTimestamp',
          'checked': false
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.startTime')
          },
          'name': 'conversationStartTimestamp | date:"mediumTime"',
          'sortOn': 'conversationStartTimestamp'
        }, {
          'header': {
            'display': $translate.instant('silentMonitoring.table.currentStateDuration')
          },
          'name': 'currentStateDuration | date:"HH:mm:ss": "UTC"',
          'sortOn': 'currentStateDuration'
        }, {
          "header": {
            "display": "Actions"
          },
          "linkText": "Monitor Call",
          "actionLink": true,
          "name": "action"
        }],
        'title': $translate.instant('silentMonitoring.table.title'),
        'orderBy': 'activeParticipants',
        'reverseSort': 'true',
        'showBulkActions': false,
        'showCreate': false,
        'searchOn': [{
          path: 'activeParticipants'
        }, {
          path: 'customer'
        }, {
          path: 'contactPoint'
        }, {
          path: 'flowId'
        }, {
          path: 'channelType'
        }, {
          path: 'direction'
        }],
        'greaterOrLessThan': {
          display: $translate.instant('silentMonitoring.table.filter.duration'),
          path: 'currentStateDuration',
          units: [{
            'display': $translate.instant('silentMonitoring.table.filter.durationUnit.min'),
            'value': '60000'
          }, {
            'display': $translate.instant('silentMonitoring.table.filter.durationUnit.sec'),
            'value': '1000'
          }]
        }
      };
    }
  ]);