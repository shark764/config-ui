'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['toastr', function(toastr) {
    return {
      restrict: 'E',
      scope: {
        resource: '=',
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

        $scope.save = function () {
          var promise = $scope.resource.save();
          promise.then($scope.handleSuccess, $scope.handleErrors);
        };

        $scope.saveAndNew = function () {
          $scope.resource.save($scope.originalResource);
        };

        $scope.handleSuccess = function () {
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

        $scope.$watch('originalResource', function () {
          $scope.resource = angular.copy($scope.originalResource);
        });

        $scope.cancel = function () {
          angular.copy($scope.originalResource, $scope.resource);
          $scope.resetForm();
        };

        $scope.resetForm = function () {
          $scope.detailsForm.$setPristine();
          $scope.detailsForm.$setUntouched();
        };
        
        $scope.$on('resource:details:cancel', function() {
          $scope.cancel();
        });
        
        $scope.$on('resource:details:save', function() {
          $scope.save();
        });
      }
    };
  }]);
