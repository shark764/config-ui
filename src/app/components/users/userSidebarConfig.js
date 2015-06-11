'use strict';

angular.module('liveopsConfigPanel')
  .constant('userSidebarConfig', {
    title: 'Management',
    links: [{
      display: 'Users',
      link: '#/users',
      id: 'user-management-link'
    }, {
      display: 'Groups',
      link: '#/groups',
      id: 'group-management-link'
    }, {
      display: 'Skills',
      link: '#/skills',
      id: 'skill-management-link'
    }, {
      display: 'Roles',
      link: '#/',
      id: 'role-management-link'
    }]
  })
