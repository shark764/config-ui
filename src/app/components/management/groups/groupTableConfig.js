'use strict';

angular.module('liveopsConfigPanel')
  .service('groupTableConfig', ['statuses', '$translate', 'UserPermissions', '$rootScope', 'PermissionGroups',
    function(statuses, $translate, UserPermissions, $rootScope, PermissionGroups) {
      var config = {
        'searchOn': ['$original.name', '$original.description'],
        'orderBy': '$original.name',
        'sref': 'content.management.groups',
        'title': $translate.instant('group.table.title'),
        'helpLink': $rootScope.helpURL + '/Help/Content/Managing%20Users/Creating_Groups.htm',
        'showBulkActions': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_GROUPS');
        },
        'showCreate': function() {
          return UserPermissions.hasPermission('MANAGE_ALL_GROUPS');
        }
      };

      config.fields = [{
        'header': {
          'display': $translate.instant('value.name')
        },
        'name': '$original.name'
      }, {
        'header': {
          'display': $translate.instant('value.description')
        },
        'name': '$original.description'
      }];

      if (UserPermissions.hasPermissionInList(PermissionGroups.viewGroupMembers)) {
        config.fields.push({
          'header': {
            'display': $translate.instant('group.table.members')
          },
          'name': '$members',
          'transclude': true,
          'sortOn': '$members.length'
        });
      }

      config.fields.push({
        'header': {
          'display': $translate.instant('value.status'),
          'valuePath': 'value',
          'displayPath': 'display',
          'options': statuses()
        },
        'name': '$original.active',
        'id': 'status-column-dropdown',
        'transclude': true,
      });

      $rootScope.$on( "updateHelpURL", function () {
      	config.helpLink = $rootScope.helpURL + '/Help/Content/Managing%20Users/Creating_Groups.htm';
      });

      return config;
    }
  ]);
