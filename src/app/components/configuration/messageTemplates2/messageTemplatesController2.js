'use strict';

angular.module('liveopsConfigPanel')
 .controller('messageTemplatesController2', ['$scope', '$sce', 'config2Url',
   function ($scope, $sce, config2Url) {
     if(location.hash.includes('alpha')) {
       $scope.messageTemplatesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/messageTemplates?alpha');
     } else {
       $scope.messageTemplatesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/messageTemplates');
     }
   }
 ]);