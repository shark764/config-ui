'use strict';

angular.module('liveopsConfigPanel')
  .service('userSkillsBulkActionTypes', ['$filter',
    function ($filter) {
      return [{
        value: 'add',
        display: $filter('translate')('bulkActions.skills.add')
      }, {
        value: 'update',
        display: $filter('translate')('bulkActions.skills.update')
      }, {
        value: 'remove',
        display: $filter('translate')('bulkActions.skills.remove')
      }];
    }
  ]);