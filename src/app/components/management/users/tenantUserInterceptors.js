'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantUserTransformer', ['User', 'TenantRole', function(User, TenantRole) {
    var rename = function(tenantUser, fieldName, newFieldName) {
      tenantUser[newFieldName] = tenantUser[fieldName];
      delete tenantUser[fieldName];
    }
    
    var moveToUser = function(tenantUser, source, destination) {
      tenantUser.$user[destination ? destination : source] = tenantUser[source];
      delete tenantUser[source];
    };

    var copyToUser = function(tenantUser, member) {
      tenantUser.$user[member] = tenantUser[member];
    };
    
    this.transform = function(tenantUser) {
      tenantUser.$user = new User();
      
      if(tenantUser.userId) {
        rename(tenantUser, 'userId', 'id');
      }
      
      moveToUser(tenantUser, 'firstName');
      moveToUser(tenantUser, 'lastName');
      moveToUser(tenantUser, 'externalId');
      moveToUser(tenantUser, 'personalTelephone');
      moveToUser(tenantUser, 'platformStatus', 'status');
      
      copyToUser(tenantUser, 'id');
      copyToUser(tenantUser, 'email');
      
      rename(tenantUser, 'groups', '$groups');
      rename(tenantUser, 'skills', '$skills');
      
      if(tenantUser.roleName) {
        rename(tenantUser, 'roleName', '$roleName');
      } else {
        tenantUser.$roleName = TenantRole.getName(tenantUser.roleId)
      }

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
