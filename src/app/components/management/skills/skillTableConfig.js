'use strict';

angular.module('liveopsConfigPanel')
  .service('skillTableConfig', ['statuses', '$translate', 'UserPermissions', 'ynStatuses', 'helpDocsHostname', function (statuses, $translate, UserPermissions, ynStatuses, helpDocsHostname) {
     var config = {
        'fields': [{
          'header': {
            'display': $translate.instant('value.name')
          },
          'name': '$original.name'
        }, {
          'header': {
            'display': $translate.instant('value.description')
          },
          'name': '$original.description'
        }, {
          'header': {
            'display': $translate.instant('skill.table.members')
          },
          'name': '$members',
          'transclude': true,
          'sortOn': '$members.length'
        }, {
          'header': {
            'display': $translate.instant('skill.table.proficiency'),
            'options': ynStatuses(),
            'valuePath': 'value',
            'displayPath': 'display',
          },
          'filter': 'selectedOptions',
          'transclude': true,
          'name': '$original.hasProficiency',
          'id': 'proficiency-column-dropdown'
        }, {
          'header': {
            'display': $translate.instant('value.status'),
            'valuePath': 'value',
            'displayPath': 'display',
            'options': statuses()
          },
          'filter': 'selectedOptions',
          'transclude': true,
          'name': '$original.active',
          'id': 'status-column-dropdown'
        }],
        'searchOn' : ['$original.name', '$original.description'],
        'orderBy' : '$original.name',
        'sref' : 'content.management.skills',
        'title': $translate.instant('skill.table.title'),
        'helpLink' : helpDocsHostname + '/Content/Managing%20Users/Adding_skills.htm',
        'showBulkActions': function() { return UserPermissions.hasPermission('MANAGE_ALL_SKILLS'); },
        'showCreate': function () { return UserPermissions.hasPermission('MANAGE_ALL_SKILLS'); },
      };

     return config;
    }
  ]);
