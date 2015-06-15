'use strict';

angular.module('liveopsConfigPanel')
  .service('skillTableConfig', [
    function () {
      return {
        'fields': [{
          'header': 'Skill',
          'name': 'name'
        }, {
          'header': 'Description',
          'name': 'description'
        }, {
          'header': 'Members',
          'name': 'members',
        }, {
          'header': 'Proficiency',
          'name': 'hasProficiency',
        }, {
          'header': 'Status',
          'name': 'status',
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : ['name'],
        'title': 'Skills Management'
      };
    }
  ])
