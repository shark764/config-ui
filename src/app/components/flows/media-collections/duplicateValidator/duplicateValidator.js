'use strict';

angular.module('liveopsConfigPanel')
  .directive('mediaMapDuplicate', ['MediaCollection', function () {
    return {
      scope: {
        form: '=',
        resource: '='
      },
      link: function ($scope, $elm, $attrs, $ctrl) {
        $scope.$watch('resource.mediaMap', function(newMediaMap) {
          var mapValid = [];
          angular.forEach(newMediaMap, function(outterMap, outterIndex) {
            angular.forEach(newMediaMap, function(innerMap, innerIndex) {
              if(outterMap === innerMap) {
                return;
              }
              
              var isValid = outterMap.lookup !== innerMap.lookup;
              
              mapValid[outterIndex] = mapValid[outterIndex] !== false && isValid;
              mapValid[innerIndex] = mapValid[innerIndex] !== false && isValid;
              
              $scope.form['mapping' + outterIndex].$setValidity('mediaMapDuplicate', mapValid[outterIndex]);
              $scope.form['mapping' + innerIndex].$setValidity('mediaMapDuplicate', mapValid[innerIndex]);
            });
          });
          
          return true;
        }, true)
      }
    };
  }]);