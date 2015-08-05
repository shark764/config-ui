'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig', 'mediaTypes', 'Chain',
    function ($scope, Media, Session, mediaTableConfig, mediaTypes, Chain) {
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
      
      $scope.forms = {};
      $scope.$watch('forms.mediaForm.audiosource', function(newValue){
        if ($scope.selectedMedia && $scope.selectedMedia.isNew() && angular.isDefined(newValue)){
          $scope.forms.mediaForm.audiosource.$setDirty();
          $scope.forms.mediaForm.audiosource.$setTouched();
        }
      });
      
      var mediaSaveChain = Chain.get('media:save');
      
      mediaSaveChain.hook('save', function() {
        return $scope.selectedMedia.save();
      });
      
      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });
      
      $scope.tableConfig = mediaTableConfig;
      $scope.mediaTypes = mediaTypes;
    }
  ]);