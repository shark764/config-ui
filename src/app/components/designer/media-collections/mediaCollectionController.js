'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig',
  function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig) {
    $scope.Session = Session;
    $scope.medias = [];
    $scope.redirectToInvites();

    $scope.fetch = function(){

      Media.query({tenantId : Session.tenant.tenantId}, function (result){
        angular.copy(result, $scope.additionalCollections.medias);
      });

      $scope.mediaCollections = MediaCollection.query({tenantId : Session.tenant.tenantId});
    };

    $scope.$on('on:click:create', function(){
      $scope.selectedMediaCollection = new MediaCollection({
        tenantId: Session.tenant.tenantId,
        mediaMap: []
      });
    });


    $scope.additionalMedia = {
      cancelMedia: function (){
        $scope.selectedMedia = null;
      },

      postSave: function() {
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

      createMediaMapping: function(media) {
        $scope.waitingMedia = media;

        $scope.selectedMedia = new Media({
          tenantId: Session.tenant.tenantId
        });
      }

    };

    $scope.$watch('Session.tenant.tenantId', function () {
      $scope.fetch();

      if($scope.mediaCreateHandler){
        $scope.mediaCreateHandler();
      }

      $scope.mediaCreateHandler = $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':media', function (event, resource) {
        $scope.medias.push(resource);
      });

      if($scope.mediaCollectionsCreateHandler){
        $scope.mediaCollectionsCreateHandler();
      }

      $scope.mediaCollectionsCreateHandler = $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':mediaCollections', function(event, resource){
        $scope.mediaColletions.push(resource);
        $scope.selectedMediaCollection = resource;
      });

    });

    $scope.fetch();
    $scope.tableConfig = mediaCollectionTableConfig;
  }]);
