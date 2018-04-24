'use strict';

angular.module('liveopsConfigPanel')
  .controller('supervisorToolbarController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.supervisorToolbarHostname = $sce.trustAsResourceUrl(config2Url + '/#/supervisorToolbar');
    }
  ]);