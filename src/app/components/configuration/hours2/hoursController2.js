'use strict';

angular.module('liveopsConfigPanel')
 .controller('hoursController2', ['$scope', '$sce', 'config2Url',
   function ($scope, $sce, config2Url) {
     if(location.hash.includes('alpha')) {
       $scope.businessHoursTemplateHostName = $sce.trustAsResourceUrl(config2Url + '/#/configuration/businessHours?alpha');
     } else {
       $scope.businessHoursTemplateHostName = $sce.trustAsResourceUrl(config2Url + '/#/configuration/businessHours');
     }
   }
 ]);