'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session', 'DirtyForms', '$translate',
    function($rootScope, $scope, $state, AuthService, Session, DirtyForms, $translate) {
      $scope.Session = Session;
      
      $scope.onCreateClick = function() {
        DirtyForms.confirmIfDirty(function(){
          $rootScope.$broadcast('on:click:create');
        });
      };
      
      $scope.onActionsClick = function() {
        DirtyForms.confirmIfDirty(function(){
          $rootScope.$broadcast('on:click:actions');
        });
      };
      
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
              DirtyForms.confirmIfDirty(function(){
                Session.setTenant(tenant);
              });
            }
          });
        });

        $scope.tenantDropdownItems = tenantDropdownItems;
      };

      $scope.isActive = function(viewLocation) {
        return $state.current.name !== '' ? $state.href($state.current.name).indexOf(viewLocation) === 1 : false;
      };

      $scope.logout = function() {
        AuthService.logout();
        $state.transitionTo('login');
        $rootScope.$broadcast('logout');
      };
      
      $scope.userDropdownItems = [{
        label: $translate.instant('navbar.logout'),
        onClick: function() {
          $scope.logout();
        },
        iconClass: 'fa fa-sign-out'
      }, {
        label: $translate.instant('navbar.profile'),
        onClick: function() {
          $state.transitionTo('content.userprofile');
        },
        iconClass: 'fa fa-gear'
      }];
      
      $scope.$on('resource:create', $scope.onCreateClick);
      $scope.$on('resource:actions', $scope.onActionsClick);
      
      $scope.$watch('Session.tenants', $scope.populateTenantsHandler);
    }
  ]);
