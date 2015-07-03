'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session',
    function($rootScope, $scope, $state, AuthService, Session) {
      $scope.Session = Session;

      $scope.populateTenantsHandler = function() {
        if (!Session.isAuthenticated()) {
          return;
        }

        if (!Session.tenant.tenantId && Session.tenants.length) {
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

      $scope.$watch('Session.tenants', $scope.populateTenantsHandler);

      $scope.isActive = function(viewLocation) {
        return $state.current.name !== '' ? $state.href($state.current.name).indexOf(viewLocation) === 1 : false;
      };

      $scope.logout = function() {
        AuthService.logout();
        $state.transitionTo('login');
        $rootScope.$broadcast('logout');
      };

      $scope.userDropdownItems = [{
        label: 'Log Out',
        onClick: function() {
          $scope.logout();
        },
        iconClass: 'fa fa-sign-out'
      }, {
        label: 'User Profile',
        onClick: function() {
          $state.transitionTo('content.userprofile');
        },
        iconClass: 'fa fa-gear'
      }];
    }
  ]);
