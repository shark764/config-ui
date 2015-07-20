'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes',
    function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes) {
      $scope.Session = Session;
      $scope.medias = [];
      $scope.redirectToInvites();

      $scope.create = function () {
        $scope.selectedMediaCollection = new MediaCollection({
          tenantId: Session.tenant.tenantId
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
      
      MediaCollection.prototype.preCreate = function () {
        if (angular.isDefined(this.mediaMap)){
          $scope.cleanMediaMap(this);
        }
      };
      
      MediaCollection.prototype.preUpdate = function () {
        if (angular.isDefined(this.mediaMap)){
          $scope.cleanMediaMap(this);
        }
      };
      
      $scope.cleanMediaMap = function(collection){
        var cleanedMediaMap = [];
        angular.forEach(collection.mediaMap, function(mapping){
          //Remove extra name property used to display the media name,
          //And description which is present when loading an existing media collection
          delete mapping.name;
          delete mapping.description;
        //angular.copy will strip the $$hashKey properties that are added by the ng-options
          cleanedMediaMap.push(angular.copy(mapping));
        });
        
        collection.mediaMap = cleanedMediaMap;
      }

      MediaCollection.prototype.postSave = function () {
        $scope.selectedMedia = null;
      };

      $scope.additionalMedia = {
        mediaTypes: mediaTypes
      };
      
      $scope.addMapping = function(collection, form){
        form.$setDirty();
        
        if(collection.mediaMap){
          collection.mediaMap.push({});
        } else {
          collection.mediaMap = [{}];
        }
      };
      
      $scope.removeMapping = function(collection, form, index){
        collection.mediaMap.splice(index, 1);
        form.$removeControl(form['mapping' + index]);
        form.$removeControl(form['source' + index]);
        if (collection.mediaMap.length === 0){
          delete collection.mediaMap;
        }
        
        form.mediaMapChanges.$setDirty();
      };

      $scope.additionalCollections = {
        medias: $scope.medias,
        addMapping: $scope.addMapping,
        removeMapping: $scope.removeMapping
      };

      $scope.$on('resource:details:create:mediaMapping', function (event, media) {
        $scope.waitingMedia = media;

        $scope.selectedMedia = new Media({
          properties: {},
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