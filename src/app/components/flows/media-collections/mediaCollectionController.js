'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$rootScope', '$scope', '$timeout', 'MediaCollection', 'Media', 'Session', 'mediaCollectionTableConfig', 'mediaTypes', 'loEvents', 'twilioLangs', 'twilioVoices',
    function($rootScope, $scope, $timeout, MediaCollection, Media, Session, mediaCollectionTableConfig, mediaTypes, loEvents, twilioLangs, twilioVoices) {
      $scope.forms = {};
      $scope.Session = Session;
      $scope.showSecondPanel = false;

      $scope.create = function() {
        $scope.selectedMediaCollection = new MediaCollection({
          tenantId: Session.tenant.tenantId,
          mediaMap: [{}]
        });
      };

      $scope.fetchMedias = function() {
        return Media.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchMediaCollections = function() {
        return MediaCollection.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.submitMediaCollection = function() {
        $scope.bypassMultipicker = false;
        return $scope.selectedMediaCollection.save();
      };

      $scope.submitMedia = function() {
        $scope.mediaDetailsController.submit($scope.selectedMedia, $scope.forms.mediaForm, false);
      };

      $scope.submitMediaAndNew = function() {
        $scope.mediaDetailsController.submit($scope.selectedMedia, $scope.forms.mediaForm, true);
      };

      // make sure that we enable auto-selection on the mapping multipicker now
      // that the second panel is closed
      $scope.$on(loEvents.tableControls.altClose, function () {
        $scope.bypassMultipicker = false;
        $scope.closeAddlPanel();
      });

      $scope.$on('created:resource:Media', function () {
        if ($scope.showSecondPanel !== true) {
          // this counteracts the forcing of the setting of the media form to pristine
          // after saving
          $scope.forms.mediaCollectionForm.$setDirty();
        }
      });

      $scope.$on('resource:details:create:Media', function(event, mediaMap) {
        $scope.bypassMultipicker = false;
        $scope.currentMediaMap = mediaMap;

        // first, check if the first media panel is open
        if ($scope.selectedMedia) {

          // if it is open, and there is a saved media item in the form,
          // then that means that we are creating a new media to replace
          // all of the data in this form, so let's clear the form
          if ($scope.selectedMedia.id) {
            $scope.selectedMedia = null;
            $scope.forms.mediaForm.$setPristine();
            $scope.selectedMedia = new Media({
              properties: {},
              type: 'audio',
              tenantId: Session.tenant.tenantId
            });
          } else {
            // if the media item has *not* yet been saved, then this means
            // that we are creating a new media item via a media list, which means
            // we need to open another media panel to create the new item
            $scope.showSecondPanel = true;
            $scope.selectedMedia.secondScope = null;
            $scope.selectedMedia.secondScope = new Media({
              properties: {},
              type: 'audio',
              tenantId: Session.tenant.tenantId
            });

            // since we're on the second panel, setting bypassMultipicker to true
            // ensures that whatever new media we create only updates the media list
            // panel multipicker and NOT the media collections panel multipicker
            $scope.bypassMultipicker = true;
          }
        } else {
          // if the media panel hasn't been opened yet, then we're opening
          // the first media panel
          $scope.selectedMedia = new Media({
            properties: {},
            type: 'audio',
            tenantId: Session.tenant.tenantId
          });
        }
      });

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });

      $rootScope.$on('closeAddlPanel', function (event, emitPayload) {
        // only carry out this code block if we're saving
        if (emitPayload.data.isSaving === true) {

          // if we are on the media collections page (for some reason I need to
          // specify this otherwise the behavior is showing up on other pages for some odd reason),
          // and I just closed the 2nd media panel, make sure that the existing media panel is now
          // set to dirty
          if ((emitPayload.data.formName === 'forms.mediaFormAddl' || emitPayload.data.stateName === 'content.flows.media-collections') && emitPayload.data.formName !== 'forms.mediaForm') {
            $scope.forms.mediaForm.$setDirty();
          } else {
            // otherwise, if we only saved the first media form, set that form to pristine
            if (emitPayload.data.formName === 'forms.mediaForm' || emitPayload.data.stateName === 'content.flows.media-collections') {
              if ($scope.forms) {
                $scope.forms.mediaForm.$setPristine();
              }
            }
          }
        }
      });

      $scope.tableConfig = mediaCollectionTableConfig;
      $scope.mediaTypes = mediaTypes;
      $scope.twilioLangs = twilioLangs;
      $scope.twilioVoices = twilioVoices;
    }
  ]);
