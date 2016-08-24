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
        return Media.cachedQuery({
          tenantId: Session.tenant.tenantId
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
