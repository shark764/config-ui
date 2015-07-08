'use strict';

angular.module('liveopsConfigPanel')
  .service('skillTableConfig', ['statuses', '$translate',
    function (statuses, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'name'
        }, {
          'header': $translate.instant('value.description'),
          'name': 'description'
        }, {
          'header': $translate.instant('skill.table.members'),
          'name': 'members',
        }, {
          'header': $translate.instant('skill.table.proficiency'),
          'templateUrl': 'app/components/management/skills/proficiencyTemplate.html',
          'name': 'hasProficiency'
        }, {
          'header': $translate.instant('value.status'),
          'options': statuses(),
          'filter': 'selectedOptions',
          'templateUrl': 'app/shared/templates/statuses.html',
          'name': 'status',
        }],
        'searchOn' : ['name', 'description'],
        'orderBy' : ['name'],
        'title': $translate.instant('skill.table.title')
      };
    }
  ]);