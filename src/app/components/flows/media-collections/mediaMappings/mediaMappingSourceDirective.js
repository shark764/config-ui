'use strict';

angular.module('liveopsConfigPanel')
.directive('mediaMappingSource', [function () {
  return {
    restrict: 'E',
    scope: {
      mapping: '=',
      fieldName: '@',
      medias: '=',
      onDirty: '&'
    },
    templateUrl: 'app/components/flows/media-collections/mediaMappings/mediaMappingSource.html',
    link: function ($scope) {
      $scope.onSelect = function(selectedMedia){
        $scope.mapping.id = selectedMedia.id;
        $scope.mapping.name = selectedMedia.name;
        $scope.onDirty();
        $scope.editMode = false;
      };
      
      $scope.$on('resource:details:media:create:success',
        function (event, resource) {
          if ($scope.editMode){
            $scope.onSelect(resource);
          }
      });
      
      $scope.createMapping = function(){
        $scope.$emit('resource:details:create:mediaMapping', $scope.mapping);
      }
    }
  };
}]);
