'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['statuses', 'userStates', '$translate',
    function(statuses, userStates, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'name': 'fullName',
          'templateUrl': 'app/components/management/users/userFullNameTemplate.html'
        }, {
          'header': $translate.instant('user.table.displayName'),
          'name': 'displayName'
        }, {
          'header': $translate.instant('value.email'),
          'name': 'email'
        }, {
          'header': $translate.instant('user.table.externalId'),
          'name': 'externalId'
        }, {
          'header': $translate.instant('user.table.state'),
          'name': 'state',
          'templateUrl': 'app/components/management/users/userStateTemplate.html',
          'checked': false,
          'options': userStates
        }, {
          'header': $translate.instant('value.status'),
          'name': 'status',
          'templateUrl': 'app/shared/templates/statuses.html',
          'checked': false,
          'options': statuses()
        }],
        'searchOn': ['firstName', 'lastName', {
          path: 'skills',
          inner: {
            path: 'name'
          }
        }],
        'orderBy': ['lastName'],
        'title': $translate.instant('user.table.title')
      };
    }
  ]);
