'use strict';

angular.module('liveopsConfigPanel')
  .directive('integrationListeners', [function() {
    return {
      scope: {
        integration: '='
      },
      templateUrl: 'app/components/configuration/integrations/listeners/listeners.html',
      controller: 'ListenersController'
    };
  }]);
