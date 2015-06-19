'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'lodash',
  function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig, _) {
    $scope.Session = Session;

    $scope.redirectToInvites();
    $scope.mediaMap = [];

    $scope.fetch = function(){
      $scope.mediaCollections = MediaCollection.query({tenantId : Session.tenant.tenantId});
    };

    $scope.createMediaMapping = function() {
      $scope.selectedMedia = new Media({
        tenantId : Session.tenant.tenantId
      });
    };

    $scope.cancelMedia = function() {
      $scope.selectedMedia = null;
    };

    $scope.createMedia = function(parentScope, result) {
      $scope.selectedMedia = null;
    };

    $scope.createNewMedia = function(parentScope) {
      $scope.selectedMedia = new Media({
        tenantId: Session.tenant.tenantId
      });
    };

    $scope.removeCollectionMedia = function(media){
      index = _.findIndex($scope.selectedMediaCollection.mediaMap, { id : media.id });
      $scope.selectedMediaCollection.mediaMap.splice(index, 1);
      $scope.selectedMediaCollection.save();
    };

    $scope.$watch('selectedMediaCollection', function () {
    });

    $scope.$on('on:click:create', function(){
      $scope.selectedMediaCollection = new MediaCollection({
        tenantId: Session.tenant.tenantId
      });
    });

    $scope.additional = {
      createMediaMapping: $scope.createMediaMapping,
      cancelMedia: $scope.cancelMedia,
      postSave: $scope.createMedia,
      postSaveAndNew: $scope.createNewMedia,
      mediaMap : $scope.mediaMap,
      removeCollectionMedia: $scope.removeCollectionMedia
    };

    $scope.$watch('Session.tenant.tenantId', function () {
      $scope.fetch();

      if($scope.mediaCreateHandler){
        $scope.mediaCreateHandler();
      }

      $scope.mediaCreateHandler = $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':media', function (event, resource) {
        $scope.selectedMediaCollection.mediaMap.push({id: resource.id, lookup: resource.source});
        $scope.additional.mediaMap.push(resource);
        $scope.selectedMediaCollection.save();
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