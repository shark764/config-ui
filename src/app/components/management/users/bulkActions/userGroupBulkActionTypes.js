'use strict';

angular.module('liveopsConfigPanel')
  .service('userGroupBulkActionTypes', ['$filter',
    function ($filter) {
      return [{
        value: 'add',
        display: $filter('translate')('bulkActions.userGroups.add')
      }, {
        value: 'remove',
        display: $filter('translate')('bulkActions.userGroups.remove')
      }];
    }
  ]);