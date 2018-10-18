'use strict';

angular.module('liveopsConfigPanel')
  .controller('dataAccessReportsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.dataAccessReportsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dataAccessReports?alpha');
      } else {
        $scope.dataAccessReportsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dataAccessReports');
      }
    }
  ]);
