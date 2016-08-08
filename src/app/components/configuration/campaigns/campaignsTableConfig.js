'use strict';

angular.module('liveopsConfigPanel')
  .service('campaignsTableConfig', ['statuses', '$translate', 'UserPermissions', 'helpDocsHostname', function (statuses, $translate, UserPermissions, helpDocsHostname) {
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
        'name': '$original.description',
        'optional': true
      }, {
        'header': {
          'display': $translate.instant('campaigns.table.dialer')
        },
        'name': '$original.currentState'
      }, {
        'header': {
          'display': $translate.instant('details.channelType')
        },
        'name': '$original.channel'
      }, {
        'header': {
          'display': $translate.instant('campaigns.table.flow')
        },
        'name': 'flowName'
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
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title': $translate.instant('campaigns.table.title'),
      'sref': 'content.configuration.campaigns',
      'showCreate': function () {
        return UserPermissions.hasPermission('MANAGE_CAMPAIGNS');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('MANAGE_CAMPAIGNS');
      }
      //NEED TO CHANGE FOR CAMPAIGNS
      //'helpLink': helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Business%20Hours/Business_Hours.htm'
    };
  }]);
