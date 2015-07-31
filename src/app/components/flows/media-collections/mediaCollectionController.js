'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$q', '$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', '$timeout', 'Alert', 'Chain',
    function ($q, $scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, $timeout, Alert, Chain) {
      var self = this;
      $scope.Session = Session;
      $scope.redirectToInvites();

      MediaCollection.prototype.preCreate = function () {
        if (angular.isDefined(this.mediaMap)) {
          $scope.cleanMediaMap(this);
        }
      };

      MediaCollection.prototype.preUpdate = function () {
        if (angular.isDefined(this.mediaMap)) {
          $scope.cleanMediaMap(this);
        }
      };

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

      $scope.cleanMediaMap = function (collection) {
        if (collection.mediaMap.length === 0) {
          delete collection.mediaMap;
          return;
        }

        var cleanedMediaMap = [];
        angular.forEach(collection.mediaMap, function (mapping) {
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
        childScope.$parent.$watch('detailsForm.audiosource', function(newValue){
          if (childScope.$parent.resource && childScope.$parent.resource.isNew() && angular.isDefined(newValue)){
            childScope.$parent.detailsForm.audiosource.$setDirty();
            childScope.$parent.detailsForm.audiosource.$setTouched();
          }
        });
      };

      var mediaCollectionSaveChain = Chain.get('media:collection:save');

      mediaCollectionSaveChain.register('save', function () {
        self.wasNew = $scope.selectedMediaCollection.isNew();
        return $scope.selectedMediaCollection.save();
      }, 0);

      mediaCollectionSaveChain.register('alert', {
        success: function (collection) {
          Alert.success('Record ' + (self.wasNew ? 'saved' : 'updated'));
          if (self.wasNew) {
            $scope.fetchMediaCollections().push(collection);
          }
          $scope.selectedMediaCollection = collection;
          return collection;
        },
        failure: function (error) {
          var deferred = $q.defer();
          Alert.error('Record failed to ' + (self.wasNew ? 'save' : 'update'));
          deferred.reject(error)
          return deferred.promise;
        }
      }, 5);

      // $scope.chains.saveMedia = [function () {
      //   $scope.selectedMedia = null;
      // }];
      // 
      // $scope.chains.saveMediaAndNew = [function () {
      //   //Use a timeout so that we aren't changing a scoped variable within a digest cycle,
      //   //Otherwise the change will not get picked up by watches
      //   //(Because this is triggered by an event, there is already a digest cycle in progress)
      //   $timeout(function () {
      //     $scope.selectedMedia = new Media({
      //       properties: {},
      //       tenantId: Session.tenant.tenantId
      //     });
      //   });
      // }];
      // 
      // $scope.chains.cancelMediaChain = [function () {
      //   $scope.selectedMedia = null;
      // }];

      $scope.$on('resource:details:create:media', function () {
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.tableConfig = mediaCollectionTableConfig;
      $scope.mediaTypes = mediaTypes;
    }
  ]);
