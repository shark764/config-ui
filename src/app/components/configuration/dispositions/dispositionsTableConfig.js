'use strict';

angular.module('liveopsConfigPanel')
  .service('dispositionsTableConfig', ['$translate', 'UserPermissions', 'helpDocsHostname', function($translate, UserPermissions, helpDocsHostname) {
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
          'display': $translate.instant('value.active')
        },
        'name': '$original.active'
      }, {
        'header': {
          'display': $translate.instant('value.shared')
        },
        'name': '$original.shared'
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title' : $translate.instant('dispositions.table.title'),
      'sref' : 'content.configuration.dispositions',
      'showCreate': function () {
        return true;
        // return UserPermissions.hasPermission('CREATE_PRESENCE_REASONS');
      },
      'showBulkActions': function () {
        return true;
        // return UserPermissions.hasPermission('UPDATE_PRESENCE_REASONS') || UserPermissions.hasPermission('DELETE_PRESENCE_REASONS') || UserPermissions.hasPermission('SHARE_PRESENCE_REASONS');
      }
    };
  }]);
