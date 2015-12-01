'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', 'Session', 'Alert', '$translate', 'queryCache', '$stateParams', 'loEvents',
    function ($scope, Session, Alert, $translate, queryCache, $stateParams, loEvents) {
      $scope.showBulkActions = false;
      $scope.Session = Session;
      
      $scope.$watch('Session.tenant', function() {
        queryCache.removeAll();
        $scope.$broadcast('session:tenant:changed');
      }, true);

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.showBulkActions = false;
      });
      
      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });

      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });
      
      $scope.$on('details:panel:close', function () {
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
