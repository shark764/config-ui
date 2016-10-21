'use strict';

angular.module('liveopsConfigPanel')
  .service('interactionsTableConfig', ['$translate', 'Session', 'Flow',
    function ($translate, Session, Flow) {

      function getFlowOptions() {
        return Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      }

      return {
        'fields': [{
          'header': {
            'display': $translate.instant('interactions.table.interactionId')
          },
          'name': 'interactionId',
          'checked': false
        }, {
          'header': {
            'display': $translate.instant('interactions.table.customerIdentification')
          },
          'name': 'customer'
        }, {
          'header': {
            'display': $translate.instant('interactions.table.contactPoint')
          },
          'name': 'contactPoint',
        }, {
          'header': {
            'display': $translate.instant('interactions.table.flow'),
            'valuePath': 'name',
            'displayPath': 'name',
            'options': getFlowOptions
          },
          'name': 'flowId'
        }, {
          'header': {
            'display': $translate.instant('interactions.table.agents')
          },
          'name': 'activeParticipants'
        }, {
          'header': {
            'display': $translate.instant('interactions.table.presenceState')
          },
          'name': 'state',
          'checked': false
        }, {
          'header': {
            'display': $translate.instant('interactions.table.channel')
          },
          'name': 'channelType'
        }, {
          'header': {
            'display': $translate.instant('interactions.table.startDate')
          },
          'name': 'conversationStartTimestamp | date:"mediumDate"',
          'sortOn': 'conversationStartTimestamp',
          'checked': false
        }, {
          'header': {
            'display': $translate.instant('interactions.table.startTime')
          },
          'name': 'conversationStartTimestamp | date:"mediumTime"',
          'sortOn': 'conversationStartTimestamp'
        }, {
          'header': {
            'display': $translate.instant('interactions.table.currentStateDuration')
          },
          'name': 'currentStateDuration | date:"HH:mm:ss": "UTC"',
          'sortOn': 'currentStateDuration'
        }, {
          'header': {
            'display': $translate.instant('interactions.table.direction')
          },
          'name': 'direction'
        }, {
          "header": {
            "display": "Actions"
          },
          "linkText": "Monitor Call",
          "actionLink": true,
          "name": "action"
        }],
        'orderBy': 'customer',
        'reverseSort': 'true',
        'showBulkActions': false,
        'showCreate': false,
        'showSearch': false
      };
    }
  ]);
