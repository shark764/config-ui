'use strict';

angular.module('liveopsConfigPanel')
  .controller('RecordingsController', ['$scope', 'Recording', 'Session', 'recordingsTableConfig',
    function ($scope, Recording, Session, recordingsTableConfig) {
      $scope.forms = {};

      $scope.fetchRecordings = function () {
        return Recording.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.tableConfig = recordingsTableConfig;
    }
  ]);