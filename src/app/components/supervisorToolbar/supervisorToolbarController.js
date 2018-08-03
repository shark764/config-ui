'use strict';

angular.module('liveopsConfigPanel')
  .controller('supervisorToolbarController', ['$scope', '$sce', '$location', 'config2Url',
    function ($scope, $sce, $location, config2Url) {
      $scope.supervisorToolbarHostname = $sce.trustAsResourceUrl(config2Url + '/#/supervisorToolbar');
      $scope.$watch(function(){
        return $location.path();
      }, function(value){
        if(value === '/reporting/interactionMonitoring' || CxEngage.session.getMonitoredInteraction() !== null) {
          $scope.toolbarIsVisible = true;
        } else {
          $scope.toolbarIsVisible = false;
        }
      });

    }
  ]);
