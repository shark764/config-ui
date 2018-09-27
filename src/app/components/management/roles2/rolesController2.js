'use strict';

angular.module('liveopsConfigPanel')
  .controller('rolesController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {

      if(location.hash.includes('alpha')) {
        $scope.rolesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/roles?alpha');
      } else {
        $scope.rolesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/roles');
      }

    }
  ]);
