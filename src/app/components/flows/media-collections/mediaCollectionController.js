'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', '$timeout',
    function ($scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, $timeout) {
      $scope.Session = Session;
      $scope.redirectToInvites();

      $scope.create = function () {
        $scope.selectedMediaCollection = new MediaCollection({
          tenantId: Session.tenant.tenantId
        });
      };
      $scope.fetchMediaCollections = function () {
        return MediaCollection.cachedQuery({
          tenantId: Session.tenant.tenantId
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
      
      $scope.$on('resource:details:create:media', function () {
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });
      });
      
      $scope.$on('resource:details:media:create:success', function () {
          $scope.selectedMedia = null;
      });
      
      $scope.$on('resource:details:media:canceled', function () {
        $scope.selectedMedia = null;
      });
      
      $scope.$on('resource:details:media:savedAndNew', function () {
        //Use a timeout so that we aren't changing a scoped variable within a digest cycle,
        //Otherwise the change will not get picked up by watches
        //(Because this is triggered by an event, there is already a digest cycle in progress)
        $timeout(function(){
          $scope.selectedMedia = new Media({
            properties: {},
            tenantId: Session.tenant.tenantId
          });
        });
      });
      
      $scope.cleanMediaMap = function(collection){
        if (collection.mediaMap.length === 0){
          delete collection.mediaMap;
          return;
        }

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
      };

      //TODO: remove duplication from MediaController
      $scope.setupAudioSourceWatch = function(childScope){
        childScope.$watch('detailsForm.audiosource', function(newValue){
          if (angular.isDefined(newValue)){
            childScope.detailsForm.audiosource.$setDirty();
            childScope.detailsForm.audiosource.$setTouched();
          }
        });
      };

      $scope.additionalMedia = {
        mediaTypes: mediaTypes,
        setupAudioSourceWatch: $scope.setupAudioSourceWatch
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.tableConfig = mediaCollectionTableConfig;
    }
  ]);
