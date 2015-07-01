'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['toastr', 'lodash', function(toastr, _) {
    return {
      restrict: 'E',
      scope: {
        originalResource: '=',
        headerTemplateUrl: '@',
        bodyTemplateUrl: '@',
        footerTemplateUrl: '@',
        extendScope: '='
      },
      templateUrl: 'app/shared/directives/resourceDetails/resourceDetails.html',

      link: function ($scope, ele) {

        ele.addClass('details-pane');

        angular.extend($scope, $scope.extendScope);

        $scope.save = function (successEventName, failureEventName) {
          if(!angular.isDefined(successEventName)) {
            successEventName = 'resource:details:saved'
          }

          if(!angular.isDefined(failureEventName)) {
            failureEventName = 'resource:details:failed'
          }

          return $scope.resource.save()
            .then($scope.handleSuccess, $scope.handleErrors)
            .then($scope.$emit(successEventName), $scope.$emit(failureEventName));
        };

        $scope.handleSuccess = function (resource) {
          $scope.resetForm();

          angular.copy($scope.resource, $scope.originalResource);
          toastr.success('Record ' + ($scope.resource.id ? 'updated' : 'saved'));
        };

        $scope.handleErrors = function (error) {
          toastr.error('Record failed to ' + ($scope.resource.id ? 'update' : 'save'));

          if (error.data.error) {

            var attributes = error.data.error.attribute;

            angular.forEach(attributes, function (value, key) {
              $scope.detailsForm[key].$setValidity('api', false);
              $scope.detailsForm[key].$error = {
                api: value
              };
              $scope.detailsForm[key].$setTouched();
            });
          }
        };

        $scope.$watch('resource.id', function () {
          $scope.resetForm();
        });

        $scope.$watch('originalResource', function (nv, ov) {
          if(ov === null || typeof ov === 'undefined' ||
            ((ov.id && nv.id !== ov.id) || (ov.id && !nv.id))){
            $scope.resource = angular.copy($scope.originalResource);

            window.resource = $scope.resource;
            window.oResource = $scope.originalResource;
            window.rddScope = $scope;
          }
        });

        $scope.cancel = function () {
          angular.copy($scope.originalResource, $scope.resource);
          $scope.resetForm();
          $scope.$emit('resource:details:canceled')
        };

        $scope.resetForm = function () {
          $scope.detailsForm.$setPristine();
          $scope.detailsForm.$setUntouched();
        };

        $scope.$on('resource:details:cancel', function() {
          $scope.cancel();
        });
      }
    };
  }]);
