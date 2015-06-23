'use strict';

angular.module('liveopsConfigPanel')
  .service('dispatchMappingTableConfig', ['statuses', function (statuses) {
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
        'name': 'interactionField'
      }, {
        'header': 'Channel Type',
        'name': 'channelType'
      }, {
        'header': 'Status',
        'name': 'active',
        'sortable': true,
        'options': statuses,
        'templateUrl': 'app/shared/templates/active.html',
        'filter': 'selectedOptions'
      }],
      'searchOn': ['name'],
      'orderBy': ['name'],
      'title' : 'Dispatch Mapping Management'
    };
  }]);
