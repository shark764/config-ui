'use strict';

angular.module('liveopsConfigPanel')
  .controller('groupsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.groupsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/groups?alpha');
      } else {
        $scope.groupsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/groups');
      }
    }
  ]);
