'use strict';

angular.module('liveopsConfigPanel').controller('AgentStateMonitoringController', [
  '$scope',
  '$location',
  '$sce',
  'config2Url',
  function($scope, $location, $sce, config2Url) {
    $scope.agentStateMonitoringHostname = $sce.trustAsResourceUrl(config2Url + '/#/agentStateMonitoring');
    //TODO: Below can be removed when the original silent monitoring page is removed.
    function tryTwilioCleanUp() {
      if (window.Twilio && window.Twilio.Device) {
        Twilio.Device.offline(function() {
          console.warn('Previous Twilio connection cleaned up ok.');
        });
        return Twilio.Device.destroy();
      } else {
        setTimeout(function() {
          tryTwilioCleanUp();
        }, 500);
      }
    }
    tryTwilioCleanUp();
  }
]);
