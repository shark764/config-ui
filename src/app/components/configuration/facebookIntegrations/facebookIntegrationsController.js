'use strict';

angular.module('liveopsConfigPanel')
  .controller('facebookIntegrationsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.facebookIntegrationsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/facebookIntegrations?alpha');
      } else {
        $scope.facebookIntegrationsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/facebookIntegrations');
      }
    }
  ]);
