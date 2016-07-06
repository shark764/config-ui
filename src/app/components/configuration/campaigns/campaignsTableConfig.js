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
          'display': $translate.instant('details.channelType')
        },
        'name': '$original.channel'
      }, {
        'header': {
          'display': $translate.instant('campaigns.table.dialer')
        },
        'name': '$original.dialer'
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title': $translate.instant('campaigns.table.title'),
      'sref': 'content.configuration.campaigns',
      'showCreate': function () {
        return true
        //return UserPermissions.hasPermission('MANAGE_ALL_CAMPAIGNS');
      },
      'showBulkActions': function () {
        return true
        //return UserPermissions.hasPermission('MANAGE_ALL_CAMPAIGNS');
      },
      //NEED TO CHANGE FOR CAMPAIGNS
      'helpLink': helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Business%20Hours/Business_Hours.htm'
    };
  }]);