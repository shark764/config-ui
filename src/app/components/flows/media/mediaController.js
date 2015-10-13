'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig',
    function ($scope, Media, Session, mediaTableConfig) {
      $scope.Session = Session;
      $scope.forms = {};

      $scope.create = function () {
        $scope.selectedMedia = new Media({
          properties: {},
          type: 'audio',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchMedias = function () {
        return Media.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.tableConfig = mediaTableConfig;
    }
  ]);