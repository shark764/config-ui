'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig',
  function ($scope, Media, Session, mediaTableConfig) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.medias = Media.query({tenantId : Session.tenant.tenantId});
    }

    $scope.createMedia = function(){
      $scope.selectedMedia = new Media({
        tenantId: Session.tenant.tenantId
      });
    }

    $scope.$watch('Session.tenant.tenantId', function () {
      $scope.fetch();
    });

    $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':media', function(event, resource){
      $scope.medias.push(resource);
      $scope.selectedMedia = resource;
    });

    $scope.fetch();
    $scope.tableConfig = mediaTableConfig;
  }]);