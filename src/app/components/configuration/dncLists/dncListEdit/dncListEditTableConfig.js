'use strict';

angular.module('liveopsConfigPanel')
  .service('dncListEditTableConfig', ['statuses', '$translate', '$stateParams', 'UserPermissions', 'helpDocsHostname', function (statuses, $translate, $stateParams, UserPermissions, helpDocsHostname) {

    return {
      getName: function (name) {
        this.title = name;
      },
      'fields': [{
        'header': {
          'display': $translate.instant('dncEdit.table.contact')
        },
        'name': '$original.contact'
      }, {
        'header': {
          'display': $translate.instant('dncEdit.table.expiration')
        },
        'name': '$original.expiration',
        'transclude': true,
      }],
      'searchOn': ['$original.contact'],
      'orderBy': '$original.expiration',
      'sref': 'content.configuration.dncEdit',
      'transclude': true,
      'showCreate': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'showListImport': function () {
        return true;
        //return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'showListMgmt': function () {
        return true;
        //return UserPermissions.hasPermission('MANAGE_ALL_BUSINESS_HOURS');
      },
      'helpLink': helpDocsHostname + '/Help/Content/Configuring%20CxEngage/Business%20Hours/Business_Hours.htm'
    };
  }]);
