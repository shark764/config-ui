'use strict';

angular.module('liveopsConfigPanel')
  .controller('supervisorToolbarController', ['$scope', '$sce', '$location', 'config2Url',
    function ($scope, $sce, $location, config2Url) {
      $scope.supervisorToolbarHostname = $sce.trustAsResourceUrl(config2Url + '/#/supervisorToolbar');
      $scope.$watch(function(){
        return $location.path();
      }, function(value){
        if(value === '/reporting/interactionMonitoring' || CxEngage.session.getMonitoredInteraction() !== null) {
          $scope.supervisorToolbarIsVisible = true;
        } else {
          $scope.supervisorToolbarIsVisible = false;
        }
      });
      CxEngage.subscribe('cxengage/interactions/voice/silent-monitor-end', function(error, topic, response) {
        if($location.path() !== '/reporting/interactionMonitoring' ) {
          $scope.$apply(function () {
            $scope.supervisorToolbarIsVisible = false;
          });
        }
      });

    }
  ]);
