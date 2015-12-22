'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig', 'loEvents',
    function($scope, Media, Session, mediaTableConfig, loEvents) {
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
    }
  ]);
