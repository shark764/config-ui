'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', 'loEvents',
    function($scope, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, loEvents) {
      $scope.forms = {};
      $scope.Session = Session;

      $scope.create = function() {
        $scope.selectedMediaCollection = new MediaCollection({
          tenantId: Session.tenant.tenantId,
          mediaMap: [{}]
        });
      };

      $scope.fetchMediaCollections = function() {
        return MediaCollection.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.submitMediaCollection = function() {
        return $scope.selectedMediaCollection.save();
      };

      $scope.submitMedia = function() {
        return $scope.mediaDetailsController.submit().then(function(media) {
          $scope.selectedMedia = null;
          return media;
        });
      };

      $scope.submitMediaAndNew = function() {
        return $scope.mediaDetailsController.submit().then(function(media) {
          $scope.selectedMedia = new Media({
            properties: {},
            tenantId: Session.tenant.tenantId
          });

          return media;
        });
      };

      $scope.$on('resource:details:create:Media', function(event, mediaMap) {
        $scope.currentMediaMap = mediaMap;
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });

      $scope.tableConfig = mediaCollectionTableConfig;
      $scope.mediaTypes = mediaTypes;
    }
  ]);
