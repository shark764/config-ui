'use strict';

angular.module('liveopsConfigPanel')
  .controller('outboundIdentifierListsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.outboundIdentifierListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/outboundIdentifierLists');
    }
  ]);
