'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['statuses', 'userStates', '$translate',
    function(statuses, userStates, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'resolve': function(user) {
            return user.firstName + ' ' + user.lastName;
          }
        }, {
          'header': $translate.instant('value.email'),
          'name': 'email'
        }, {
          'header': $translate.instant('user.table.externalId'),
          'name': 'externalId'
        }, {
          'header': $translate.instant('user.table.state'),
          'name': 'state',
          'transclude': true,
          'blah': 'userState',
          'checked': false,
          'options': userStates
        }, {
          'header': $translate.instant('value.status'),
          'name': 'status',
          'transclude': true,
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
