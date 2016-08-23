'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig', 'loEvents', 'twilioLangs', 'twilioVoices',
    function($scope, Media, Session, mediaTableConfig, loEvents, twilioLangs, twilioVoices) {
      $scope.Session = Session;
      $scope.forms = {};

      $scope.create = function() {
        $scope.selectedMedia = new Media({
          properties: {},
          type: 'audio',
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchMedias = function() {
        // Forcing the resource table to show the spinner, since we have to do work on the response before showing it *facepalm*
        $scope.media = {};
        $scope.media.$promise = true;
        $scope.media.$resolved = false;
        
        Media.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function(mediaItems) {
          $scope.media = mediaItems.filter(function(item) {
            return item.type !== 'list';
          });
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });

      $scope.tableConfig = mediaTableConfig;
      $scope.twilioLangs = twilioLangs;
      $scope.twilioVoices = twilioVoices;
      $scope.fetchMedias();
    }
  ]);
