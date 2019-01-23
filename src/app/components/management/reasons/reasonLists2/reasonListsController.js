'use strict';

angular.module('liveopsConfigPanel')
  .controller('reasonListsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {

      if(location.hash.includes('alpha')) {
        $scope.reasonLists2Hostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/reasonLists?alpha');
      } else {
        $scope.reasonLists2Hostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/reasonLists');
      }

    }
  ]);