'use strict';

angular.module('liveopsConfigPanel')
  .controller('whatsappIntegrationsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.whatsappIntegrationsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/whatsappIntegrations?alpha');
      } else {
        $scope.whatsappIntegrationsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/whatsappIntegrations');
      }
    }
  ]);
