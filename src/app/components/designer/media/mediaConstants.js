'use strict';

angular.module('liveopsConfigPanel')
  .factory('mediaTypes', ['$filter',  function($filter) {
    return [{
      display: $filter('translate')('media.details.mediaTypes.audio'),
      value: 'audio'
    }, {
      display: $filter('translate')('media.details.mediaTypes.tts'),
      value: 'tts'
    }]
  }]);