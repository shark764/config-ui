'use strict';

angular.module('liveopsConfigPanel')
  .constant('groupSidebarConfig', {
    title: 'Management',
    links: [{
      display: 'Users',
      link: '#/users',
      id: 'user-management-link'
    }, {
      display: 'Groups',
      link: '#/',
      id: 'group-management-link'
    }, {
      display: 'Skills',
      link: '#/',
      id: 'skill-management-link'
    }, {
      display: 'Roles',
      link: '#/',
      id: 'role-management-link'
    }]
  })
