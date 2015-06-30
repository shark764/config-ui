'use strict';

angular.module('liveopsConfigPanel')
  .service('dispatchMappingTableConfig', ['statuses', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes',
    function (statuses, dispatchMappingInteractionFields, dispatchMappingChannelTypes) {
      return {
        'fields': [{
          'header': 'Name',
          'name': 'name'
        }, {
          'header': 'Description',
          'name': 'description'
        }, {
          'header': 'Value',
          'name': 'value'
        }, {
          'header': 'Interaction Field',
          'name': 'interactionField',
          'options': dispatchMappingInteractionFields,
          'filter': 'selectedOptions'
        }, {
          'header': 'Channel Type',
          'name': 'channelType',
          'options': dispatchMappingChannelTypes,
          'filter': 'selectedOptions'
        }, {
          'header': 'Status',
          'name': 'active',
          'sortable': true,
          'options': statuses(),
          'templateUrl': 'app/shared/templates/active.html',
          'filter': 'selectedOptions'
        }],
        'searchOn': ['name'],
        'orderBy': ['name'],
        'title': 'Dispatch Mapping Management'
      };
    }
  ]);