'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig',
  function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.mediaCollections = MediaCollection.query({tenantId : Session.tenant.tenantId});

      if ($scope.mediaCollections.mediaMap){
        console.log($scope.mediaCollections[1]);
      }
    }

    $scope.createMediaCollection = function(){
      $scope.selectedMediaCollection = new MediaCollection({
        tenantId: Session.tenant.tenantId
      });
    }

    function createMediaMapping() {
      $scope.selectedMedia = new Media({
        tenantId : Session.tenant.tenantId 
      });
    }

    function cancelMedia() {
      $scope.selectedMedia = null;
    }

    function createMedia(parentScope, result) {
      console.log(result);
      //$scope.selectedMediaCollection.mediaMap.push({'id':result.id, 'lookup': result.id});
      $scope.selectedMedia = null;
    }

    function createNewMedia(parentScope, result) {
      console.log(result);
      //$scope.selectedMediaCollection.mediaMap.push({'id':result.id, 'lookup': result.id});
      $scope.selectedMedia = new MediaCollection({
        tenantId: Session.tenant.tenantId
      });
    }

    $scope.additional = {
      createMediaMapping: createMediaMapping,
      cancelMedia: cancelMedia,
      createMedia: createMedia,
      createNewMedia: createNewMedia,
      postSave: createMedia,
      postSaveAndNew: createNewMedia
      //selectedMedia: $scope.selectedMedia
    };

    $scope.$watch('Session.tenant.tenantId', function () {
      $scope.fetch();
    });

    $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':mediaCollections', function(event, resource){
      console.log("HEllo");
      $scope.mediaColletions.push(resource);
      $scope.selectedMediaCollection = resource;
    });

    $scope.fetch();
    $scope.tableConfig = mediaCollectionTableConfig;
  }]);