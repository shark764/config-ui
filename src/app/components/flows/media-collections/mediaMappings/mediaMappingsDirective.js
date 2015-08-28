'use strict';

angular.module('liveopsConfigPanel')
  .directive('mediaMappings', ['Media', 'Session', function(Media, Session) {
    return {
      restrict: 'E',
      scope: {
        form: '=',
        collection: '='
      },
      templateUrl: 'app/components/flows/media-collections/mediaMappings/mediaMappings.html',
      link: function($scope) {
        $scope.fetchMedias = function() {
          return Media.cachedQuery({
            tenantId: Session.tenant.tenantId
          });
        };

        $scope.addMapping = function() {
          if ($scope.collection.mediaMap) {
            $scope.collection.mediaMap.push({});
          } else {
            $scope.collection.mediaMap = [{}];
          }
        };

        $scope.removeMapping = function(index) {
          if ($scope.collection.mediaMap[index].lookup === $scope.collection.defaultMediaKey) {
            $scope.collection.defaultMediaKey = null;
          }

          $scope.collection.mediaMap.splice(index, 1);
          if ($scope.collection.mediaMap.length === 0) {
            delete $scope.collection.mediaMap;
            delete $scope.collection.defaultMediaKey;
          }

          $scope.form.mediaMapChanges.$setDirty();
        };

        $scope.resetDefaultMediaKey = function() {
          $scope.collection.defaultMediaKey = null;
          $scope.form.defaultMediaKey.$setDirty();
          $scope.form.defaultMediaKey.$setTouched();
        };

        //TODO: review
        $scope.$on('resource:details:create:mediaMapping', function() {
          $scope.form.mediaMapChanges.$setDirty();
        });
      }
    };
  }]);