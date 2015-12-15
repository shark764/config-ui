'use strict';

angular.module('liveopsConfigPanel')
  .service('genericItemTableConfig', ['statuses', '$translate', 'Tenant', 'Session', 'UserPermissions',
    function (statuses, $translate, Tenant, Session, UserPermissions) {
      return function (list, listType, stateName) {
        var config = {
          fields: [],
          title: list.name,
          showCreate: UserPermissions.hasPermissionInList(['MANAGE_ALL_LISTS']),
          resourceKey: '$index',
          stateKey: 'index',
          orderBy: listType.fields[0].name,
          sref: stateName
        };

        angular.forEach(listType.fields, function(field) {
          config.fields.push({
            header: {
              display: field.label
            },
            name: '$original.' + field.name
          });
        });

        return config;
      };
    }
  ]);
