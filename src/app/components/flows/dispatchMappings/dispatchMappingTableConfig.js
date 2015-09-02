'use strict';

angular.module('liveopsConfigPanel')
  .service('dispatchMappingTableConfig', ['statuses', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', '$translate', 'UserPermissions',
    function (statuses, dispatchMappingInteractionFields, dispatchMappingChannelTypes, $translate, UserPermissions) {
      return {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': 'name'
        }, {
          'header': {
            'display': $translate.instant('value.description')
          },
          'name': 'description'
        }, {
          'header': {
            'display': $translate.instant('value.value')
          },
          'name': 'value'
        }, {
          'header': {
            'display': $translate.instant('dispatchMappings.table.interactionField'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': dispatchMappingInteractionFields
          },
          'name': 'interactionField',
          'id': 'integration-column-dropdown',
          'lookup': '$original:interactionField',
          'filter': 'selectedOptions'
        }, {
          'header': {
            'display': $translate.instant('dispatchMappings.table.channelType'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': dispatchMappingChannelTypes
          },
          'name': 'channelType',
          'lookup': '$original:channelType',
          'filter': 'selectedOptions'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'name': 'active',
          'id': 'status-column-dropdown',
          'lookup': '$original:active',
          'sortable': true,
          'transclude': true,
          'filter': 'selectedOptions'
        }],
        'searchOn': ['name'],
        'orderBy': 'name',
        'title': $translate.instant('dispatchmappings.table.title'),
        'showCreate': UserPermissions.hasPermission('MAP_ALL_CONTACT_POINTS'),
        'showBulkActions': UserPermissions.hasPermission('MAP_ALL_CONTACT_POINTS')
      };
    }
  ]);
