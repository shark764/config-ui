'use strict';


angular.module('liveopsConfigPanel')
  .directive('duplicateUsername', ['$q', 'User', function ($q, User) {
    return {
      require: 'ngModel',
      link: function ($scope, elem, attrs, ctrl) {
        ctrl.$asyncValidators.duplicateUsername = function (modelValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.when();
          }

          var def = $q.defer();

          User.query({
            email: modelValue
          }).$promise.then(function (result) {
            if (result.length > 0) {
              return def.reject();
            }

            return def.resolve();
          }, function (error) {

            // If the request 404s, assume the email is unique
            if (error.status === 404) {
              return def.resolve();
            }

            // By default, on error, reject
            return def.reject();
          });

          return def.promise;
        };
      }
    };
  }]);