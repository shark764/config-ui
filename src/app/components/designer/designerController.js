'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerController', ['$scope', '$state',
    function($scope, $state) {

      $scope.sidebarConfig = {
        title: 'Management',
        links: [{
          display: 'Flows',
          link: $state.href('designer.flows'),
          id: 'flow-management-link'
        }, {
          display: 'Queues',
          link: $state.href('designer.queues'),
          id: 'queue-management-link'
        }, {
          display: 'Media',
          link: '#/media',
          id: 'media-management-link'
        }]
    };;
    }
  ]);


