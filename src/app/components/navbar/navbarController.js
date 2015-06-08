'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$location', 'AuthService', 'Session', 'Tenant',
    function($rootScope, $scope, $location, AuthService, Session, Tenant) {
      $scope.Session = Session;

      var populateTenantsHandler = function(event) {
        if (!$scope.Session.isAuthenticated()) {
          return;
        }

        $scope.tenants = Tenant.query({
          regionId: Session.activeRegionId
        }, function() {
          if (!Session.tenant && $scope.tenants.length) {
            Session.tenant = $scope.tenants[0];
          }
        });
      };

      $scope.$on('login:success', populateTenantsHandler);
      $scope.$watch('Session.activeRegionId', populateTenantsHandler);

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
