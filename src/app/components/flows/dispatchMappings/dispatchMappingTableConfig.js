'use strict';

angular.module('liveopsConfigPanel')
  .service('dispatchMappingTableConfig', ['statuses', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', '$translate',
    function (statuses, dispatchMappingInteractionFields, dispatchMappingChannelTypes, $translate) {
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
            'display': $translate.instant('value.value')
          },
          'name': '$original.value'
        }, {
          'header': {
            'display': $translate.instant('dispatchMappings.table.interactionField'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': dispatchMappingInteractionFields
          },
          'name': '$original.interactionField',
          'lookup': '$original:interactionField',
          'filter': 'selectedOptions'
        }, {
          'header': {
            'display': $translate.instant('dispatchMappings.table.channelType'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': dispatchMappingChannelTypes
          },
          'name': '$original.channelType',
          'lookup': '$original:channelType',
          'filter': 'selectedOptions'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'name': '$original.active',
          'lookup': '$original:active',
          'sortable': true,
          'transclude': true,
          'filter': 'selectedOptions'
        }],
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'title': $translate.instant('dispatchmappings.table.title')
      };
    }
  ]);
