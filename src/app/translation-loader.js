'use strict';

//Separate the translation loader from the main config because
//it needs to be excluded from unit tests

angular.module('liveopsConfigPanel')
  .config(['$translateProvider', function($translateProvider) {
    $translateProvider
      .useStaticFilesLoader({
        prefix: '/translations/',
        suffix: '.json'
      });
  }]);
