'use strict';

angular.module('liveopsConfigPanel')
  .service('queueQueryComponents', ['$translate', 'jsedn', function($translate, jsedn) {
    return [{
      display: $translate.instant('queues.query.builder.skills'),
      enabled: false,
      name: 'skillcomponent',
      keyword: ':skills',
      remove: function(rootMap){
        var keyword = jsedn.kw(':skills');
        rootMap.remove(keyword);
      }
    }, {
      display: $translate.instant('queues.query.builder.groups'),
      enabled: false,
      name: 'groupcomponent',
      keyword: ':groups',
      remove: function(rootMap){
        var keyword = jsedn.kw(':groups');
        rootMap.remove(keyword);
      }
    }];
  }]);