'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig',
  function ($scope, Media, Session, mediaTableConfig) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.medias = Media.query({tenantId : Session.tenant.id});
    }

    $scope.createMedia = function(){
      $scope.selectedMedia = new Media({
        tenantId: Session.tenant.id
      });
    }

    $scope.$watch('Session.tenant.id', function () {
      $scope.fetch();
    });

    $scope.$on('created:resource:tenants:' + Session.tenant.id + ':media', function(event, resource){
      $scope.medias.push(resource);
      $scope.selectedMedia = resource;
    });

    $scope.fetch();
    $scope.tableConfig = mediaTableConfig;
  }]);