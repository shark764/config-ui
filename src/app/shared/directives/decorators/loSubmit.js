'use strict';

angular.module('liveopsConfigPanel')
  .directive('loSubmit', ['$q', function ($q) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit', '?^loFormCancel'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';
        
        var loFormSubmit = $ctrl[0];
        var loFormCancel = $ctrl[1];
        
        $elem.bind($attrs.event, function () {
          //TODO check if $attrs.loSubmit is actually a thing that return resource
          var promise = $q.when($scope.$eval($attrs.loSubmit));
          
          promise = promise.then(function(resource) {
            if(loFormCancel) {
              loFormCancel.resetForm();
            }
            
            return resource;
          },
          function(error) {
            var def = $q.defer();
            loFormSubmit.populateApiErrors(error);
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
