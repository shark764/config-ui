'use strict';

angular.module('liveopsConfigPanel')
  .controller('ContentController', ['$scope', '$state', 'Alert', 'Session', '$translate', 'queryCache',
    function ($scope, $state, Alert, Session, $translate, queryCache) {
      $scope.$watch('Session.tenant', function(news) {
        if(news) {
          queryCache.removeAll();
        }
      });

      $scope.$on('table:on:click:create', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:resource:selected', function (event, selectedItem) {
        $scope.showBulkActions = false;
      });
    }
  ]);
