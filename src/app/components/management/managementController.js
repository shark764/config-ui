'use strict';

angular.module('liveopsConfigPanel')
  .controller('ManagementController', ['$scope', '$state',
    function($scope, $state) {

      $scope.sidebarConfig = {
        title: 'Management',
        links: [{
          display: 'Users',
          link: $state.href('content.management.users'),
          id: 'user-management-link'
        }, {
          display: 'Groups',
          link: $state.href('content.management.groups'),
          id: 'group-management-link'
        }, {
          display: 'Skills',
          link: $state.href('content.management.skills'),
          id: 'skill-management-link'
        }]
      };
    }
  ]);
