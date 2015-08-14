'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$q', '$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', 'Alert', 'Chain',
    function ($q, $scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, Alert, Chain) {
      $scope.forms = {};
      $scope.Session = Session;
      $scope.redirectToInvites();

      MediaCollection.prototype.preSave = function () {
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

      $scope.setCurrentMediaMap = function(media) {
        if($scope.currentMediaMap) {
          $scope.currentMediaMap.id = media.id;
          $scope.currentMediaMap.name = media.name;
          $scope.currentMediaMap.description = media.description;

          $scope.forms.mediaCollectionForm.$setDirty();
        }
      };

      //TODO: remove duplication from MediaController
      $scope.$watch('forms.mediaForm.audiosource', function(newValue){
        if ($scope.selectedMedia && $scope.selectedMedia.isNew() && angular.isDefined(newValue)){
          $scope.forms.mediaForm.audiosource.$setDirty();
          $scope.forms.mediaForm.audiosource.$setTouched();
        }
      });

      var mediaCollectionSaveChain = Chain.get('media:collection:save');
      var mediaSaveChain = Chain.get('media:save');
      var mediaSaveAndNewChain = Chain.get('media:save:and:new');

      mediaCollectionSaveChain.hook('save', function () {
        return $scope.selectedMediaCollection.save();
      }, 0);

      mediaSaveChain.hook('save', function () {
        return $scope.selectedMedia.save();
      }, 0);

      mediaSaveChain.hook('post save', function (media) {
        $scope.selectedMedia = null;
        $scope.setCurrentMediaMap(media);
      }, 1);

      mediaSaveAndNewChain.hook('save', function () {
        return $scope.selectedMedia.save();
      }, 0);

      mediaSaveAndNewChain.hook('and:new', function (media) {
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });

        $scope.setCurrentMediaMap(media);
      }, 1);

      $scope.$on('resource:details:create:media', function (event, mediaMap) {
        $scope.currentMediaMap = mediaMap;
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
