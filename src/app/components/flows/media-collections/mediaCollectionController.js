'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes',
    function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes) {
      $scope.Session = Session;
      $scope.medias = [];
      $scope.redirectToInvites();

      $scope.create = function () {
        $scope.selectedMediaCollection = new MediaCollection({
          tenantId: Session.tenant.tenantId,
          mediaMap: []
        });
      };
      $scope.fetch = function () {
        $scope.mediaCollections = MediaCollection.query({
          tenantId: Session.tenant.tenantId
        }, function () {
          if (!$scope.mediaCollections.length) {
            $scope.create();
          }
        });

        Media.query({
          tenantId: Session.tenant.tenantId
        }, function (result) {
          angular.copy(result, $scope.additionalCollections.medias);
        });
      };

      MediaCollection.prototype.postSave = function () {
        $scope.selectedMedia = null;
      };

      $scope.additionalMedia = {
        mediaTypes: mediaTypes
      };

      $scope.additionalCollections = {
        medias: $scope.medias
      };

      $scope.$on('resource:details:create:mediaMapping', function (event, media) {
        $scope.waitingMedia = media;

        $scope.selectedMedia = new Media({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$on('resource:details:media:canceled', function () {
        $scope.selectedMedia = null;
        $scope.waitingMedia = null;
      });

      $scope.$on('resource:details:media:savedAndNew', function () {
        $scope.waitingMedia = null;

        $scope.selectedMedia = new Media({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.$watch('Session.tenant', function (old, news) {
        if (!angular.equals(old, news)) {
          $scope.fetch();
        }
      }, true);

      $scope.$on('resource:details:media:create:success',
        function (event, resource) {
          $scope.medias.push(resource);

          if ($scope.waitingMedia) {
            $scope.waitingMedia.id = resource.id;
          }
          
          $scope.selectedMedia = null;
        });

      $scope.fetch();
      $scope.tableConfig = mediaCollectionTableConfig;
    }
  ]);