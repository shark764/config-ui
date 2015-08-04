'use strict';

angular.module('liveopsConfigPanel')
.directive('mediaMappingSource', ['$timeout', function ($timeout) {
  return {
    restrict: 'E',
    scope: {
      mapping: '=',
      fieldName: '@',
      medias: '=',
      onDirty: '&'
    },
    templateUrl: 'app/components/flows/media-collections/mediaMappings/mediaMappingSource.html',
    link: function ($scope, ele) {
      $scope.onSelect = function(selectedMedia){
        $scope.mapping.id = selectedMedia.id;
        $scope.mapping.name = selectedMedia.name;
        $scope.onDirty();
        $scope.editMode = false;
        $scope.createMode = false;
      };
      
      $scope.$on('resource:details:media:create:success',
        function (event, resource) {
          if ($scope.createMode){
            $scope.onSelect(resource);
          }
      });
      
      $scope.createMedia = function(){
        $scope.$emit('resource:details:create:media');
        $scope.createMode = true;
      };
      
      $scope.$on('resource:details:media:canceled', function () {
        $scope.createMode = false;
      });
      
      $scope.labelClick = function(){
        $scope.editMode = !$scope.editMode;
        if ($scope.editMode){
          $timeout(function(){
            var input = ele.find('type-ahead input');
            input.focus();
          });
        }
      };
    }
  };
}]);
