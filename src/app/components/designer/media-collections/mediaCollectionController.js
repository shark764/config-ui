'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes',
    function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes) {
      $scope.Session = Session;
      $scope.medias = [];
      $scope.redirectToInvites();

      $scope.create = function() {
        $scope.selectedMediaCollection = new MediaCollection({
          tenantId: Session.tenant.tenantId,
          mediaMap: []
        });
      };
      
      $scope.fetch = function () {
        Media.query({
          tenantId: Session.tenant.tenantId
        }, function (result) {
          angular.copy(result, $scope.additionalCollections.medias);
        });

        $scope.mediaCollections = MediaCollection.query({
          tenantId: Session.tenant.tenantId
        }, function() {
          if(!$scope.mediaCollections.length) {
            $scope.create();
          }
        });
      };

      $scope.additionalMedia = {
        mediaTypes: mediaTypes,
        cancelMedia: function () {
          $scope.selectedMedia = null;
          $scope.waitingMedia = null;
        },

        postSave: function () {
          $scope.selectedMedia = null;
        },

        postSaveAndNew: function () {
          $scope.selectedMedia = new Media({
            tenantId: Session.tenant.tenantId
          });
        }
      };

      $scope.additionalCollections = {
        medias: $scope.medias,

        createMediaMapping: function (media) {
          $scope.waitingMedia = media;

          $scope.selectedMedia = new Media({
            tenantId: Session.tenant.tenantId
          });
        }
      };

      $scope.$on('on:click:create', function () {
        $scope.create();
      });

      $scope.$watch('Session.tenant', function (old, news) {
        if(angular.equals(old, news)){
          return;
        }

        $scope.fetch();

        if ($scope.mediaCreateHandler) {
          $scope.mediaCreateHandler();
        }

        $scope.mediaCreateHandler = $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':media', function (event, resource) {
          $scope.medias.push(resource);

          if ($scope.waitingMedia) {
            $scope.waitingMedia.id = resource.id;
          }
        });

        if ($scope.mediaCollectionsCreateHandler) {
          $scope.mediaCollectionsCreateHandler();
        }

        $scope.mediaCollectionsCreateHandler = $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':mediaCollections', function (event, resource) {
          $scope.mediaCollections.push(resource);
          $scope.selectedMediaCollection = resource;
        });

      }, true);

      $scope.fetch();
      $scope.tableConfig = mediaCollectionTableConfig;
    }
  ]);