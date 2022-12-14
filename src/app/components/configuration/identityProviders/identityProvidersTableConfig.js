'use strict';

angular.module('liveopsConfigPanel')
  .service('identityProvidersTableConfig', ['statuses', '$translate', 'UserPermissions', 'PermissionGroups', 'CustomDomain', function(statuses, $translate, UserPermissions, PermissionGroups, CustomDomain) {

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
        'name': '$original.description',
        'optional': true
      }, {
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': '$original.active',
        'id': 'status-column-dropdown',
        'sortable': true,
        'transclude': true,
        'filter': 'selectedOptions'
      }],
      'searchOn': ['$original.name'],
      'orderBy': '$original.name',
      'title' : $translate.instant('identityProviders.table.title'),
      'helpLink' : CustomDomainSvc.getHelpURL('/Help/Content/Configuration/SSO/IdentityProviders.htm'),
      'baseHelpLink' : '/Help/Content/Configuration/SSO/IdentityProviders.htm',
      'sref' : 'content.configuration.identityProviders',
      'showCreate': function () {
        return UserPermissions.hasPermissionInList(PermissionGroups.manageIdentityProviders);
      },
      'showBulkActions': function () {
        return UserPermissions.hasPermissionInList(PermissionGroups.manageIdentityProviders);
      }
    };
  }]);
