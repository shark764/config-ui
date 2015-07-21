'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig', 'mediaTypes',
    function ($scope, Media, Session, mediaTableConfig, mediaTypes) {
      $scope.Session = Session;

      $scope.create = function () {
        $scope.selectedMedia = new Media({
          properties: {},
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetch = function () {
        $scope.medias = Media.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.fetch();
      $scope.tableConfig = mediaTableConfig;
      
      $scope.setupAudioSourceWatch = function(childScope){
        childScope.$watch('detailsForm.audiosource', function(newValue){
          if (angular.isDefined(newValue)){
            childScope.detailsForm.audiosource.$setDirty();
            childScope.detailsForm.audiosource.$setTouched();
          }
        });
      };
      
      $scope.additional = {
        mediaTypes: mediaTypes,
        setupAudioSourceWatch: $scope.setupAudioSourceWatch
      };
    }
  ]);