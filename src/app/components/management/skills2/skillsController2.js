'use strict';

angular.module('liveopsConfigPanel')
  .controller('skillsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.skillsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/skills?alpha');
      } else {
        $scope.skillsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/skills');
      }
    }
  ]);
