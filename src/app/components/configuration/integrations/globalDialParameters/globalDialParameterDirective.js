'use strict';

angular.module('liveopsConfigPanel')
  .directive('integrationGlobalDialParameters', [function() {
    return {
      scope: {
        integration: '=',
        fetchGlobalDialParameters: '&'
      },
      templateUrl: 'app/components/configuration/integrations/globalDialParameters/globalDialParameters.html',
      controller: 'GlobalDialParameterController'
    };
  }]);
