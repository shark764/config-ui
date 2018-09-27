'use strict';

angular.module('liveopsConfigPanel')
  .controller('genericListsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.genericListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/lists?alpha');
      } else {
        $scope.genericListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/lists');
      }
    }
  ]);
