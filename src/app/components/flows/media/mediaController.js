'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$rootScope', '$scope', '$location', '$q', '$timeout', 'Media', 'Session', 'mediaTableConfig', 'loEvents', 'twilioLangs', 'twilioVoices',
    function ($rootScope, $scope, $location, $q, $timeout, Media, Session, mediaTableConfig, loEvents, twilioLangs, twilioVoices) {
      $scope.Session = Session;
      $scope.forms = {};
      $scope.showSecondPanel = false;
      var MediaSvc = new Media();

      var emitPayloadData;

      $scope.create = function () {
        $scope.selectedMedia = null;
        $scope.selectedMedia = new Media({
          properties: {},
          type: 'audio',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchMedias = function () {
        return Media.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $q.when($scope.fetchMedias().$promise).then(function () {
        MediaSvc.getListSourceName($scope.fetchMedias());
      });

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.create();
      });

      $scope.$on(loEvents.tableControls.itemSelected, function () {
        $timeout(function () {
          // this is where we check on the data from last media item saved in
          // order to determine whether or not to completely wipe out the second media panel
          if (emitPayloadData) {
            if (emitPayloadData.formName !== 'forms.mediaFormAddl') {
              if ($scope.forms && emitPayloadData.stateName === 'content.flows.media') {
                $scope.forms.mediaForm.$setPristine();
                $scope.forms.mediaForm.$setUntouched();
                $scope.forms.mediaFormAddl.$setPristine();
                $scope.selectedMedia.secondScope = null;
                $scope.showSecondPanel = false;
              }
            }
          }
        });
      });

      $scope.$on(loEvents.bulkActions.close, function () {
        if ($scope.selectedMedia.secondScope) {
          $scope.closeAddlPanel();
        } else {
          $scope.selectedMedia = null;
          $scope.forms.mediaForm.$setPristine();
          $scope.forms.mediaForm.$setUntouched();
        }
      });

      $scope.$on('deleteAudio', function () {
        delete $scope.selectedMedia.secondScope.source;
      });

      $scope.$on('closeAddlPanel', function () {
        if ($scope.showSecondPanel !== true) {
          $scope.forms.mediaForm.$setPristine();
        }
      });

      $rootScope.$on('closeAddlPanel', function (event, emitPayload) {
        // here we provide the page with the data it needs in order to properly set the
        // state of the forms in both panels
        emitPayloadData = emitPayload.data;
        if (emitPayload.data.isSaving === true && emitPayload.data.formName === 'forms.mediaFormAddl') {
          if ($scope.forms.mediaForm) {
            $scope.forms.mediaForm.$setDirty();
          }

          if ($scope.forms.mediaFormAddl) {
            $scope.forms.mediaFormAddl.$setPristine();
          }

          $scope.selectedMedia.secondScope = null;
          $scope.showSecondPanel = false;
        }
      });

      $scope.$on('resource:details:create:Media', function () {
        $scope.showSecondPanel = true;
        $scope.forms.mediaFormAddl.$setPristine();
        $scope.forms.mediaFormAddl.$setUntouched();
        $scope.selectedMedia.secondScope = new Media({
          properties: {},
          type: 'audio',
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.tableConfig = mediaTableConfig;
      $scope.twilioLangs = twilioLangs;
      $scope.twilioVoices = twilioVoices;
    }
  ]);
