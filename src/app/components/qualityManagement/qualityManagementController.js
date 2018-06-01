'use strict';

angular.module('liveopsConfigPanel')
  .controller('qualityManagementController', ['$scope', '$sce', 'qualityManagementUrl', 'Session',
    function ($scope, $sce, qualityManagementUrl, Session) {
      $scope.qualityManagementUrl = $sce.trustAsResourceUrl(qualityManagementUrl + '/wfo?token=' + Session.token + '&tenantId=' + Session.tenant.tenantId + '&page=Dashboard');
    }
  ]);
