'use strict';

angular.module('liveopsConfigPanel')
  .controller('NavbarController', ['$rootScope', '$scope', '$state', 'AuthService', 'Session', 'DirtyForms', '$translate',
    function($rootScope, $scope, $state, AuthService, Session, DirtyForms, $translate) {
      $scope.hovering = false;
      
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

        if (!Session.tenant.tenantId && Session.tenants && Session.tenants.length) {
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
      
      
      $scope.hoverTracker = [];

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
      
      $scope.managementDropConfig = [{
          label: 'Users',
          onClick: function(){$state.transitionTo('content.management.users');},
          id: 'user-management-link',
          order: 1
        }, {
          label: 'Groups',
          onClick: function(){$state.transitionTo('content.management.groups');},
          id: 'group-management-link',
          order: 2
        }, {
          label: 'Skills',
          onClick: function(){$state.transitionTo('content.management.skills');},
          id: 'skill-management-link',
          order: 3
      }];
      
      $scope.configurationDropConfig = [{
          label: 'Tenants',
          onClick: function(){$state.transitionTo('content.configuration.tenants');},
          id: 'tenants-configuration-link',
          order: 1
        }, {
          label: 'Integrations',
          onClick: function(){$state.transitionTo('content.configuration.integrations');},
          id: 'integrations-configuration-link',
          order: 2
        }];
      
      $scope.flowsDropConfig = [{
          label: 'Flows',
          onClick: function(){$state.transitionTo('content.flows.flowManagement');},
          id: 'flow-management-link',
          order: 1
        }, {
          label: 'Queues',
          onClick: function(){$state.transitionTo('content.flows.queues');},
          id: 'queue-management-link',
          order: 2
        }, {
          label: 'Media Collections',
          onClick: function(){$state.transitionTo('content.flows.media-collections');},
          id: 'media-collection-management-link',
          order: 3
        }, {
          label: 'Media',
          onClick: function(){$state.transitionTo('content.flows.media');},
          id: 'media-management-link',
          order: 4
        }, {
          label: 'Dispatch Mappings',
          onClick: function(){$state.transitionTo('content.flows.dispatchMappings');},
          id: 'dispatch-mappings-configuration-link',
          order: 5
      }];
    }
  ]);
