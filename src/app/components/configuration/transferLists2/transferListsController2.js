'use strict';

angular.module('liveopsConfigPanel')
  .controller('transferListsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.transferListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/transferLists?alpha');
      } else {
        $scope.transferListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/transferLists');
      }
    }
  ]);