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

      $scope.fetchMedias = function () {
        return Media.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.tableConfig = mediaTableConfig;
      
      $scope.setupAudioSourceWatch = function(childScope){
        childScope.$parent.$watch('detailsForm.audiosource', function(newValue){
          if (childScope.$parent.resource && childScope.$parent.resource.isNew() && angular.isDefined(newValue)){
            childScope.$parent.detailsForm.audiosource.$setDirty();
            childScope.$parent.detailsForm.audiosource.$setTouched();
          }
        });
      };
      
      $scope.additional = {
        mediaTypes: mediaTypes,
        setupAudioSourceWatch: $scope.setupAudioSourceWatch
      };
    }
  ]);