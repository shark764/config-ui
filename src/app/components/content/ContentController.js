'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', 'Region', '$state', 'Alert', 'Session',
    function ($scope, Region, $state, Alert, Session) {
      $scope.redirectToInvites = function () {
        if (!Session.tenant.tenantId) {
          $state.transitionTo('content.invites');
          Alert.warning('You have no tenants assigned to you. Invite yourself to one!');
        }
      };
    }
  ]);
