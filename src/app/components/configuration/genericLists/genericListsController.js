'use strict';

angular.module('liveopsConfigPanel')
  .controller('genericListsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.genericListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/lists');
    }
  ]);
