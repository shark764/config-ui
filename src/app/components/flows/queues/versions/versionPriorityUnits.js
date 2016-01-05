'use strict';

angular.module('liveopsConfigPanel')
  .service('versionPriorityUnits', ['$translate',
    function($translate) {
      return [{
        display: $translate.instant('queue.details.priorityUnit.seconds'),
        value: 'seconds'
      }, {
        display: $translate.instant('queue.details.priorityUnit.minutes'),
        value: 'minutes'
      }, {
        display: $translate.instant('queue.details.priorityUnit.hours'),
        value: 'hours'
      }, {
        display: $translate.instant('queue.details.priorityUnit.days'),
        value: 'days'
      }];
    }
  ]);
