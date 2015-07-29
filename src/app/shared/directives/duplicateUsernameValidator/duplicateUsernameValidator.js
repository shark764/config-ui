'use strict';


angular.module('liveopsConfigPanel')
  .directive('duplicateUsername', ['$q', 'User', function($q, User) {
    return {
      require: 'ngModel',
      link: function($scope, elm, attrs, ctrl) {
        ctrl.$asyncValidators.duplicateUsername = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.when();
          }

          var def = $q.defer();

          User.query({email: modelValue}).$promise.then(function (result) {
            if (result.length > 0) {
              return def.reject();
            }

            return def.resolve();
          }, function () {
            return def.resolve();
          });

          return def.promise;
        };
      }
    };
  }]);