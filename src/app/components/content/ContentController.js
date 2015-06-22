'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', 'Region', '$state', 'toastr', 'Session',
    function ($scope, Region, $state, toastr, Session) {
      $scope.redirectToInvites = function () {
        if (!Session.tenant.tenantId) {
          $state.transitionTo('content.invites');
          toastr.warning('You have no tenants assigned to you. Invite yourself to one!');
        }
      };
    }
  ]);
