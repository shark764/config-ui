'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', '$state', 'Alert', 'Session', '$translate', 'queryCache', '$stateParams',
    function ($scope, $state, Alert, Session, $translate, queryCache, $stateParams) {
      $scope.showBulkActions = false;
      
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
      });

      $scope.$on('table:on:click:create', function () {
        $scope.showBulkActions = false;
      });
      
      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });

      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });
      
      if ($stateParams.messageKey){
        Alert.info($translate.instant($stateParams.messageKey), '', {
          closeButton: true,
          showDuration: 0,
          hideDuration: 0,
          timeOut: 0,
          extendedTimeOut: 0
        });
      }
    }
  ]);
