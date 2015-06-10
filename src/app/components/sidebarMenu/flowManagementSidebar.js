'use strict';

angular.module('liveopsConfigPanel')
  .service('flowSidebarConfig', function () {
      return {
        title: 'Management',
        links: [{
          display: 'Flows',
          link: '#/flows',
          id: 'flow-management-link'
        }, {
          display: 'Queues',
          link: '#/',
          id: 'queue-management-link'
        }]
    };
    }
  )
