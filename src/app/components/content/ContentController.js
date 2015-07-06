'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', 'Region', '$state', 'Alert', 'Session', '$translate',
    function ($scope, Region, $state, Alert, Session, $translate) {
      $scope.redirectToInvites = function () {
        if (!Session.tenant.tenantId) {
          $state.transitionTo('content.invites');
          Alert.warning($translate.instant('content.notenants.warning'));
        }
      };
    }
  ]);
