'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session', 'Tenant', '$translate', 'Region',
    function($rootScope, $scope, $state, AuthService, Session, Tenant, $translate, Region) {
      $scope.Session = Session;

      var populateTenantsHandler = function() { 
        $scope.regions = Region.query({}, function () {
          $scope.Session.activeRegionId = $scope.regions[0].id;
        });

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
        return $state.current.name != '' ? $state.href($state.current.name).indexOf(viewLocation) === 1 : false;
      };

      $scope.logout = function() {
        AuthService.logout();
        $state.transitionTo('login');
        $rootScope.$broadcast('logout');
      };

      $scope.userDropdownItems = [{
        label: 'User Profile',
        onClick: function() {
          $state.transitionTo('userprofile');
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
