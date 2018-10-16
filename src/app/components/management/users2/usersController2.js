'use strict';

angular.module('liveopsConfigPanel')
  .controller('usersController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {

      if(location.hash.includes('alpha')) {
        $scope.usersHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/users?alpha');
      } else {
        $scope.usersHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/users');
      }

    }
  ]);
