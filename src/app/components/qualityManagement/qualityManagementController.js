'use strict';

angular.module('liveopsConfigPanel')
  .controller('qualityManagementController', ['$scope', '$sce', 'Session',
    function ($scope, $sce, Session) {
      $scope.qualityManagementUrl = $sce.trustAsResourceUrl('http://10.214.41.85/engage/wfo?token=' + Session.token + '&tenantId=' + Session.tenant.tenantId + '&page=Dashboard');
    }
  ]);
