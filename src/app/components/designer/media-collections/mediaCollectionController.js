'use strict';

angular.module('liveopsConfigPanel')
  .controller('MediaCollectionController', ['$scope', 'MediaCollection', 'Session', 'mediaCollectionTableConfig',
  function ($scope, MediaCollection, Session, mediaCollectionTableConfig) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.mediaCollections = MediaCollection.query({tenantId : Session.tenant.tenantId});
    }

    $scope.createMediaCollection = function(){
      $scope.selectedMediaCollection = new MediaCollection({
        tenantId: Session.tenant.tenantId
      });
    }

    $scope.$watch('Session.tenant.tenantId', function () {
      $scope.fetch();
    });

    $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':mediaCollections', function(event, resource){
      $scope.mediaColletions.push(resource);
      $scope.selectedMediaCollection = resource;
    });

    $scope.fetch();
    $scope.tableConfig = mediaCollectionTableConfig;
  }]);