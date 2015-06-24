'use strict';

angular.module('liveopsConfigPanel')
<<<<<<< HEAD
  .factory('mediaTypes', ['$filter',  function($filter) {
    return [{
      display: $filter('translate')('media.details.mediaTypes.audio'),
      value: 'audio'
    }, {
      display: $filter('translate')('media.details.mediaTypes.tts'),
      value: 'tts'
    }]
=======
  .constant('mediaTypes', [{
    display: 'Audio',
    value: 'audio'
  }, {
    display: 'TTS',
    value: 'tts'
>>>>>>> TITAN2-1282 fixed media colleciton list not updating and added constant for mediaTypes
  }]);