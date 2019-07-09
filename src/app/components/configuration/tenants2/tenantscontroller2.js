'use strict';
angular.module('liveopsConfigPanel')
  .controller('tenantsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.tenantsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/tenants?alpha');
      } else {
        $scope.tenantsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/tenants');
      }
    }
  ]);