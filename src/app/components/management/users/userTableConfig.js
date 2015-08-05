'use strict';

angular.module('liveopsConfigPanel')
  .service('userTableConfig', ['userStatuses', 'userStates', '$translate',
    function(userStatuses, userStates, $translate) {
      return {
        'fields': [{
          'header': $translate.instant('value.name'),
          'resolve': function(user) {
            return user.$original.getDisplay();
          },
        }, {
          'header': $translate.instant('value.email'),
          'name': '$original.email'
        }, {
          'header': $translate.instant('user.table.externalId'),
          'name': '$original.externalId'
        }, {
          'header': $translate.instant('user.table.state'),
          'name': '$original.state',
          'transclude': true,
          'checked': false,
          'options': userStates
        }, {
          'header': $translate.instant('value.status'),
          'name': '$original.status',
          'transclude': true,
          'checked': false,
          'options': userStatuses()
        }],
        'searchOn': ['firstName', 'lastName', {
          path: '$original.skills',
          inner: {
            path: 'name'
          }
        }],
        'orderBy': ['$original.lastName'],
        'title': $translate.instant('user.table.title')
      };
    }
  ]);
