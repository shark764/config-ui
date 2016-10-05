'use strict';

angular.module('liveopsConfigPanel')
  .factory('mediaTypes', ['$translate',  function($translate) {
    return [{
      display: $translate.instant('media.details.mediaTypes.audio'),
      value: 'audio'
    }, {
      display: $translate.instant('media.details.mediaTypes.tts'),
      value: 'tts'
    }, {
      display: $translate.instant('media.details.mediaTypes.list'),
      value: 'list'
    }];
  }]);
