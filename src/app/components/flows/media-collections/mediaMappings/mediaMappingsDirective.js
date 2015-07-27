'use strict';

angular.module('liveopsConfigPanel')
.directive('mediaMappings', ['Media', 'Session', function (Media, Session) {
  return {
    restrict: 'E',
    scope: {
      form: '=',
      collection: '='
    },
    templateUrl: 'app/components/flows/media-collections/mediaMappings/mediaMappings.html',
    link: function ($scope) {
      $scope.medias = Media.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
      
      $scope.addMapping = function(){
        if($scope.collection.mediaMap){
          $scope.collection.mediaMap.push({});
        } else {
          $scope.collection.mediaMap = [{}];
        }
      };
      
      $scope.removeMapping = function(index){
        $scope.collection.mediaMap.splice(index, 1);
        if ($scope.collection.mediaMap.length === 0){
          delete $scope.collection.mediaMap;
        }
        
        $scope.form.mediaMapChanges.$setDirty();
      };
      
      $scope.resetDefaultMediaKey = function(){
        $scope.collection.defaultMediaKey = null;
        $scope.form.defaultMediaKey.$setDirty();
        $scope.form.defaultMediaKey.$setTouched();
      };

      $scope.$on('resource:details:create:mediaMapping', function () {
        $scope.form.mediaMapChanges.$setDirty();
      });
      
      $scope.$on('resource:details:media:create:success',
        function (event, resource) {
          $scope.medias.push(resource);
        }
      );
    }
  };
}]);
