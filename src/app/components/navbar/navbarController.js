'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$location', 'AuthService', 'Session', 'Tenant', '$translate',
    function($rootScope, $scope, $location, AuthService, Session, Tenant, $translate) {
      $scope.Session = Session;

      var populateTenantsHandler = function() {
        if (!$scope.Session.isAuthenticated()) {
          return;
        }

        if (!Session.tenant && Session.tenants.length) {
          Session.setTenant(Session.tenants[0]);
        }

        var tenantDropdownItems = [];
        angular.forEach(Session.tenants, function(tenant) {
          tenantDropdownItems.push({
            label: tenant.name,
            onClick: function(){
              Session.setTenant(tenant);
            }
          });
        });

        $scope.tenantDropdownItems = tenantDropdownItems;
      };

      $scope.$on('login:success', populateTenantsHandler);
      
      $scope.$watch('Session.tenants', populateTenantsHandler);

      $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
      };

      $scope.logout = function() {
        AuthService.logout();
        $location.url($location.path('/login'));
        $rootScope.$broadcast('logout');
      };

      $scope.userDropdownItems = [{
        label: 'User Profile',
        onClick: function() {
          $location.path('/userprofile');
        },
        iconClass: 'fa fa-gear'
      }, {
        label: 'Log Out',
        onClick: function() {
          $scope.logout();
        },
        iconClass: 'fa fa-sign-out'
      }];
    }
  ]);
