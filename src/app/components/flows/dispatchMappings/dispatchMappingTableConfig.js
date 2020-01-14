'use strict';

angular.module('liveopsConfigPanel')
  .service('dispatchMappingTableConfig', ['statuses', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', '$translate', 'UserPermissions', 'CustomDomain',
    function(statuses, dispatchMappingInteractionFields, dispatchMappingChannelTypes, $translate, UserPermissions, CustomDomain) {

      var CustomDomainSvc = new CustomDomain();

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
          'id': 'interaction-column-dropdown',
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
          'id': 'channelType-column-dropdown',
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
          'id': 'status-column-dropdown',
          'lookup': '$original:active',
          'sortable': true,
          'transclude': true,
          'filter': 'selectedOptions'
        }, {
          'header': {
            'display': 'Flow'
          },
          'name': 'flowNameVal'
        }],
        'searchOn': ['$original.name'],
        'orderBy': '$original.name',
        'title': $translate.instant('dispatchmappings.table.title'),
        'helpLink': CustomDomainSvc.getHelpURL('/Help/Content/Managing%20Flows/Dispatch_mapping.htm'),
        'baseHelpLink': '/Help/Content/Managing%20Flows/Dispatch_mapping.htm',
        'sref': 'content.flows.dispatchMappingsOld',
        'showCreate': function() {
          return UserPermissions.hasPermission('MAP_ALL_CONTACT_POINTS');
        },
        'showBulkActions': function() {
          return UserPermissions.hasPermission('MAP_ALL_CONTACT_POINTS');
        }
    };
  }]);
