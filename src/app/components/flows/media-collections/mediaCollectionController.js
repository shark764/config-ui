'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$q', '$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', '$timeout', 'Alert', 'Chain',
    function ($q, $scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, $timeout, Alert, Chain) {
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

      mediaCollectionSaveChain.register('save', function () {
        return $scope.selectedMediaCollection.save();
      }, 0);

      mediaSaveChain.register('save', function () {
        return $scope.selectedMedia.save();
      }, 0);

      mediaSaveAndNewChain.register('save', function () {
        return $scope.selectedMedia.save();
      }, 0);

      mediaSaveChain.register('save', function () {
        $scope.selectedMedia = null;
      }, 1);

      mediaSaveAndNewChain.register('and:new', function () {
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });
      }, 1);

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
