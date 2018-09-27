'use strict';

angular.module('liveopsConfigPanel')
  .controller('chatWidgetsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.chatWidgetsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/chatWidgets?alpha');
      } else {
        $scope.chatWidgetsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/chatWidgets');
      }
    }
  ]);
