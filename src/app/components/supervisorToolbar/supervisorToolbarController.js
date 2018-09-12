'use strict';

angular.module('liveopsConfigPanel')
  .controller('supervisorToolbarController', ['$scope', '$rootScope', '$sce', '$location', 'config2Url',
    function ($scope, $rootScope, $sce, $location, config2Url) {
      $scope.supervisorToolbarHostname = $sce.trustAsResourceUrl(config2Url + '/#/supervisorToolbar');
      $rootScope.$on('$locationChangeStart', function (event, current, previous) {
        if(previous.indexOf('reporting/interactionMonitoring') > -1 && current.indexOf('reporting/silentMonitoring') > -1) {
          location.reload();
        }
      });
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
