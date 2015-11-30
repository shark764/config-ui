'use strict';

angular.module('liveopsConfigPanel')
  .service('genericItemTableConfig', ['statuses', '$translate', 'Tenant', 'Session', 'UserPermissions', 'helpDocsHostname',
    function (statuses, $translate, Tenant, Session, UserPermissions, helpDocsHostname) {
      return function (list, listType) {
        var config = {
          fields: [],
          title: list.name,
          showCreate: UserPermissions.hasPermissionInList([]),
          resourceKey: '$index',
          stateKey: 'index',
          orderBy: listType.fields[0].name
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
