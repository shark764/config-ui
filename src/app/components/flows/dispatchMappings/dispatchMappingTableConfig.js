'use strict';

angular.module('liveopsConfigPanel')
  .service('dispatchMappingTableConfig', ['statuses', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', '$translate',
    function (statuses, dispatchMappingInteractionFields, dispatchMappingChannelTypes, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'name'
        }, {
          'header': $translate.instant('value.description'),
          'name': 'description'
        }, {
          'header': $translate.instant('value.value'),
          'name': 'value'
        }, {
          'header': $translate.instant('dispatchMappings.table.interactionField'),
          'name': 'interactionField',
          'options': dispatchMappingInteractionFields,
          'filter': 'selectedOptions'
        }, {
          'header': $translate.instant('dispatchMappings.table.channelType'),
          'name': 'channelType',
          'options': dispatchMappingChannelTypes,
          'filter': 'selectedOptions'
        }, {
          'header': $translate.instant('value.status'),
          'name': 'active',
          'sortable': true,
          'options': statuses(),
          'transclude': true,
          'filter': 'selectedOptions'
        }],
        'searchOn': ['name'],
        'orderBy': 'name',
        'title': $translate.instant('dispatchmappings.table.title')
      };
    }
  ]);
