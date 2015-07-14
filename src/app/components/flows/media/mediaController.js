'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig', 'mediaTypes',
    function ($scope, Media, Session, mediaTableConfig, mediaTypes) {
      $scope.Session = Session;

      $scope.create = function () {
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetch = function () {
        $scope.medias = Media.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('on:click:create', function () {
        $scope.create();
      });

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.fetch();
      $scope.tableConfig = mediaTableConfig;
      
      $scope.additional = {
        mediaTypes: mediaTypes
      };
    }
  ]);