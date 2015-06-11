'use strict';

angular.module('liveopsConfigPanel')
  .controller('ConfigurationController', ['$scope', '$state',
    function($scope, $state) {

      $scope.sidebarConfig = {
        title: 'Configuration',
        links: [{
          display: 'Tenants',
          link: $state.href('configuration.tenants'),
          id: 'tenants-configuration-link'
        }]
      };
    }
  ]);
