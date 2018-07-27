'use strict';

angular.module('liveopsConfigPanel')
  .controller('supervisorToolbarController', ['$scope', '$sce', '$location', 'config2Url',
    function ($scope, $sce, $location, config2Url) {
      $scope.supervisorToolbarHostname = $sce.trustAsResourceUrl(config2Url + '/#/supervisorToolbar');
    }
  ]);
