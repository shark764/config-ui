(function() {
  'use strict';

  var flowSetup = function($http, AuthService) {
    return {
      seed: function(email, password) {
        var TITAN_REGION_ID;
        var TITAN_ADMIN_ID;
        var CREATED_USER_ID;
        var CREATED_USER_EMAIL;
        var CREATED_TENANT_ID;
        var CREATED_INVITE_TOKEN;
        var CREATED_FLOW_ID;
        var CREATED_VERSION_ID;
        var ACCEPTED_INVITE_STATUS;
        var PLACEHOLDER_ROLE_ID = '10f15d80-0052-11e5-b68b-fb65b1fe22e1';
        return $http.get('http://localhost:9080/v1/regions').then(function(data) {
          TITAN_REGION_ID = data.data.result[0].id;
          console.log('-- TITAN_REGION_ID --', TITAN_REGION_ID);
          return $http.post('http://localhost:9080/v1/login', {email: 'titan@liveops.com', password: 'gKVnfF9wrs6XPSYs'});
        }).then(function(data) {
          TITAN_ADMIN_ID = data.data.result.user.id;
          console.log('-- TITAN_ADMIN_ID --', TITAN_ADMIN_ID);
          return $http.post('http://localhost:9080/v1/users', {
            createdBy: TITAN_ADMIN_ID,
            email: email,
            password: password,
            firstName: 'Test',
            lastName: 'User',
            displayName: 'Test User',
            status: true,
            externalId: '00000000-0000-0000-000000000000'
          });
        }).then(function(data) {
          CREATED_USER_ID = data.data.result.id;
          CREATED_USER_EMAIL = data.data.result.email;
          console.log('-- CREATED_USER_ID --', CREATED_USER_ID);
          console.log('-- CREATED_USER_EMAIL --', CREATED_USER_EMAIL);
          return $http.post('http://localhost:9080/v1/tenants', {adminUserId: CREATED_USER_ID, createdBy: TITAN_ADMIN_ID, description: 'This is a test tenant created by the seed service.', name: 'Test Tenant', regionId: TITAN_REGION_ID});
        }).then(function(data) {
          CREATED_TENANT_ID = data.data.result.id;
          console.log('-- CREATED TENANT ID --', CREATED_TENANT_ID);
          return $http.post('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/invites', {roleId: PLACEHOLDER_ROLE_ID, email: CREATED_USER_EMAIL});
        }).then(function(data) {
          CREATED_INVITE_TOKEN = data.data.result.invitation.invitationToken;
          console.log('-- CREATED_INVITE_TOKEN --', CREATED_INVITE_TOKEN);
          console.log('-- LOG IN AS NEW USER --');
          return AuthService.login(email, password);
        }).then(function() {
          return $http.get('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/invites/' + CREATED_USER_ID + '/accept?token=' + CREATED_INVITE_TOKEN);
        }).then(function(data) {
          ACCEPTED_INVITE_STATUS = data.data.result;
          console.log('-- ACCEPTED_INVITE_STATUS --', ACCEPTED_INVITE_STATUS);
          return $http.post('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/flows', {createdBy: CREATED_USER_ID, description: 'Test flow description.', name: 'Test flow', tenantId: CREATED_TENANT_ID, type: 'customer'});
        }).then(function(data) {
          CREATED_FLOW_ID = data.data.result.id;
          console.log('-- CREATED_FLOW_ID --', CREATED_FLOW_ID);
          return $http.post('http://localhost:9080/v1/tenants/' + CREATED_TENANT_ID + '/flows/' + CREATED_FLOW_ID + '/versions', {createdBy: CREATED_USER_ID, description: 'Initial Version.', name: 'v1', flowId: CREATED_FLOW_ID, tenantId: CREATED_TENANT_ID, flow: '[]'});
        }).then(function(data) {
          CREATED_VERSION_ID = data.data.result.version;
          console.log('-- CREATED VERSION ID --', CREATED_VERSION_ID);
          console.log('\n\n Done seeding DB with all necessary data to access the flows screen. Log in as the user "' + email + '" with the password "' + password + '" and access the flows screen and go to town :)');
        });
      }
    };
  };

  angular.module('liveopsConfigPanel')
  .service('flowSetup', flowSetup);
})();
