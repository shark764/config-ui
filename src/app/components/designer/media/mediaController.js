'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaController', ['$scope', 'Media', 'Session', 'mediaTableConfig',
  function ($scope, Media, Session, mediaTableConfig) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.medias = Media.query({tenantId : Session.tenant.tenantId});
    };

    $scope.$on('on:click:create', function(){
      $scope.selectedMedia = new Media({
        tenantId: Session.tenant.tenantId
      });
    });

    $scope.$watch('Session.tenant', function () {
      $scope.fetch();
    });

    $scope.fetch();
    $scope.tableConfig = mediaTableConfig;
  }]);