'use strict';

angular.module('liveopsConfigPanel')
  .directive('loSubmit', ['$q', function ($q) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';

        $elem.bind($attrs.event, function () {
          var promise = $q.when($scope.$eval($attrs.loSubmit));
          
          promise = promise.then(function(resource) {
            $ctrl[0].resetForm();
            return resource;
          },
          function(error) {
            var def = $q.defer();
            $ctrl[0].populateApiErrors(error);
            def.reject(error);
            return def.promise;
          });
          
          promise = promise.then(function(resource) {
            $scope.$emit('form:submit:success', resource);
          }, 
          function(error) {
            $scope.$emit('form:submit:failure', error);
          });
          
          $scope.$apply();
        });
      }
    };
  }]);
