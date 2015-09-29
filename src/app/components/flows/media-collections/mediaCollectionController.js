'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$q', '$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', 'Alert',
    function ($q, $scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, Alert) {
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
      
      $scope.submitMediaCollection = function() {
        return $scope.selectedMediaCollection.save();
      };

      $scope.submitMedia = function() {
        return $scope.selectedMedia.save().then(function() {
          $scope.selectedMedia = null;
        });
      };
      
      $scope.submitMediaAndNew = function() {
        return $scope.selectedMedia.save().then(function() {
          $scope.selectedMedia = new Media({
            properties: {},
            tenantId: Session.tenant.tenantId
          });
        });
      };
      
      //TODO: remove duplication from MediaController
      $scope.$watch('forms.mediaForm.audiosource', function(newValue){
        if ($scope.selectedMedia && $scope.selectedMedia.isNew() && angular.isDefined(newValue)){
          $scope.forms.mediaForm.audiosource.$setDirty();
          $scope.forms.mediaForm.audiosource.$setTouched();
        }
      });
      
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
