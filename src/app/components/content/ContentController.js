'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', 'Region', '$state', 'Alert', 'Session', '$translate', 'queryCache',
    function ($scope, Region, $state, Alert, Session, $translate, queryCache) {
      $scope.redirectToInvites = function () {
        if (!Session.tenant.tenantId) {
          $state.transitionTo('content.invites');
          Alert.warning($translate.instant('content.notenants.warning'));
        }
      };
      
      $scope.$watch('Session.tenant', function(news) {
        if(news) {
          queryCache.removeAll();
        }
      })
    }
  ]);
