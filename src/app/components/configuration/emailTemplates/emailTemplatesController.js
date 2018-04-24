'use strict';

angular.module('liveopsConfigPanel')
  .controller('emailTemplatesController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.emailTemplatesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/emailTemplates');
    }
  ]);
