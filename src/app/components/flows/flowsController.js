'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$state',
    function($scope, $state) {

      $scope.sidebarConfig = {
        title: 'Management',
        links: [{
          display: 'Flows',
          link: $state.href('content.flows.flowManagement'),
          id: 'flow-management-link'
        }, {
          display: 'Queues',
          link: $state.href('content.flows.queues'),
          id: 'queue-management-link'
        }, {
          display: 'Media Collections',
          link: $state.href('content.flows.media-collections'),
          id: 'media-collection-management-link'
        }, {
          display: 'Media',
          link: $state.href('content.flows.media'),
          id: 'media-management-link'
        }]
    };
    }
  ]);
