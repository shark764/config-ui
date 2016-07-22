'use strict';

angular.module('liveopsConfigPanel')
  .service('contactsTableConfig', ['statuses', '$translate', 'UserPermissions', 'helpDocsHostname', function(statuses, $translate, UserPermissions, helpDocsHostname) {
    return {
      'fields': [{
      'header': {
        'display': $translate.instant('value.name')
      },
      'name': '$original.name'
    }, {
      'header': {
        'display': $translate.instant('details.phoneNumber')
      },
      'name': '$original.phoneNumber'
    }, {
      'header': {
        'display': $translate.instant('user.table.state')
      },
      'name': '$original.state'
    }, {
      'header': {
        'display': $translate.instant('user.table.country'),
      },
      'name': '$original.country'
    }, {
      'header': {
        'display': $translate.instant('tenant.details.timezone')
      },
      'name': '$original.timezone'
    }, {
      'header': {
        'display': $translate.instant('user.table.expiration')
      },
      'name': '$original.expiration'
    }],
    'searchOn': ['$original.name'],
    'orderBy': '$original.name',
    'title' : $translate.instant('contacts.table.title'),
    'sref' : 'content.configuration.contacts',
    'showCreate': function () {
      return true;
      //return UserPermissions.hasPermission('MANAGE_ALL_CAMPAIGNS');
    },
    'showBulkActions': function () {
      return true;
      //return UserPermissions.hasPermission('MANAGE_ALL_CAMPAIGNS');
    },
    //NEED TO CHANGE FOR CAMPAIGNS
    'helpLink' : helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Business%20Hours/Business_Hours.htm'
  };
}]);
