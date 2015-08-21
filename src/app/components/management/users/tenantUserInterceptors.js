'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantUserTransformer', ['User', function(User) {
    var move = function(tenantUser, source, destination) {
      tenantUser.$user[destination ? destination : source] = tenantUser[source];
      delete tenantUser[source];
    };

    var copy = function(tenantUser, member) {
      tenantUser.$user[member] = tenantUser[member];
    };

    this.transform = function(tenantUser) {
      tenantUser.$user = new User();

      move(tenantUser, 'firstName');
      move(tenantUser, 'lastName');
      move(tenantUser, 'externalId');
      move(tenantUser, 'personalTelephone');
      move(tenantUser, 'platformStatus', 'status');

      copy(tenantUser, 'id');
      copy(tenantUser, 'email');

      tenantUser.$user.$original = angular.copy(tenantUser.$user);
    };
  }])
  .service('tenantUserInterceptor', ['tenantUserTransformer',
    function(TenantUserTransformer) {
      this.response = function(response) {
        var tenantUser = response.resource;

        TenantUserTransformer.transform(tenantUser);

        return tenantUser;
      };
    }
  ])
  .service('tenantUserQueryInterceptor', ['tenantUserTransformer',
    function(TenantUserTransformer) {
      this.response = function(response) {
        angular.forEach(response.resource, function(tenantUser) {
          TenantUserTransformer.transform(tenantUser);
        });

        return response.resource;
      };
    }
  ]);
