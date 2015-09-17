'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$q', '$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', 'Alert', 'Chain',
    function ($q, $scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, Alert, Chain) {
      $scope.forms = {};
      $scope.Session = Session;

      $scope.create = function () {
        $scope.selectedMediaCollection = new MediaCollection({
          tenantId: Session.tenant.tenantId,
          mediaMap: [{}]
        });
      };
      
      $scope.fetchMediaCollections = function () {
        return MediaCollection.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
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

      mediaSaveChain.hook('post save', function () {
        $scope.selectedMedia = null;
      }, 1);

      mediaSaveAndNewChain.hook('save', function () {
        return $scope.selectedMedia.save();
      }, 0);

      mediaSaveAndNewChain.hook('and:new', function () {
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });
      }, 1);

      $scope.$on('resource:details:create:Media', function (event, mediaMap) {
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
