'use strict';

angular.module('liveopsConfigPanel')
  .directive('loSubmit', ['$q', '$parse', function ($q, $parse) {
    return {
      restrict: 'A',
      require: ['^loFormSubmit', '?^loFormCancel', '?^loFormAlert', '?^loFormReset'],
      link: function ($scope, $elem, $attrs, $ctrl) {
        $attrs.event = angular.isDefined($attrs.event) ? $attrs.event : 'click';
        
        var loFormSubmit = $ctrl[0];
        var loFormCancel = $ctrl[1];
        var loFormAlert = $ctrl[2];
        var loFormReset = $ctrl[3];
        
        $elem.bind($attrs.event, function () {
          var ngDisabled = $parse($attrs.ngDisabled)($scope);
          if(!!ngDisabled){
            return;
          }
          
          //TODO check if $attrs.loSubmit is actually a thing that return resource
          var promise = $q.when($scope.$eval($attrs.loSubmit));
          
          promise = promise.then(function(resource) {
            if(loFormCancel) {
              loFormCancel.resetForm();
            } else if (loFormReset) {
              loFormReset.resetForm();
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
            loFormAlert.alertSuccess(resource);
          }, 
          function(error) {
            loFormAlert.alertFailure(error.config.data);
          });
          
          $scope.$apply();
        });
      }
    };
  }]);
