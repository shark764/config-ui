'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', 'Session', 'Alert', '$translate', '$stateParams', 'loEvents',
    function($scope, Session, Alert, $translate, $stateParams, loEvents) {
      $scope.showBulkActions = false;
      $scope.Session = Session;

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.showBulkActions = false;
      });
      $scope.$on(loEvents.tableControls.actions, function() {
        $scope.showBulkActions = true;
      });

      $scope.$on(loEvents.tableControls.itemSelected, function() {
        $scope.showBulkActions = false;
      });

      $scope.$on(loEvents.bulkActions.close, function() {
        $scope.showBulkActions = false;
      });
      
      $scope.$on('$stateChangeSuccess', function(){
        $scope.showBulkActions = false;
      });

      if ($stateParams.messageKey) {
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
