'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig',
  function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig) {
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

    $scope.$watch('selectedMediaCollection', function () {
      $scope.additional.mediaMap.length = 0;

      if($scope.selectedMediaCollection && $scope.selectedMediaCollection.mediaMap){

        var mm = $scope.selectedMediaCollection.mediaMap;

        for(var i = 0; i < mm.length; i++) {
          $scope.additional.mediaMap.push(Media.get({id : mm[i].id, tenantId: Session.tenant.tenantId}));
        }
      }

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
      mediaMap : $scope.mediaMap
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