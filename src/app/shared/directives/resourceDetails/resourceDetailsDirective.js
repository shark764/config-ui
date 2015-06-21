'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['UserName', 'toastr', function(UserName, toastr) {
    return {
      restrict: 'E',
      scope : {
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
          $scope.loading = true;

          if($scope.preSave){
            $scope.preSave($scope);
          }

          $scope.resource.save(
            function (result) {
              $scope.handleSuccess(result);

              if($scope.postSave){
                $scope.postSave($scope, result);
              }
            },

            function (error, headers){
              $scope.handleErrors(error);

              if ($scope.postError){
                $scope.postError($scope, error, headers);
              }
            }
          );
        };

        $scope.saveAndNew = function () {
          $scope.loading = true;

          if($scope.preSaveAndNew){
            $scope.preSaveAndNew($scope);
          }

          $scope.resource.save($scope.originalResource,
            function (result) {
              $scope.handleSuccess(result);

              if($scope.postSaveAndNew){
                $scope.postSaveAndNew($scope, result);
              }
            },

            function (error, headers){
              $scope.handleErrors(error);

              if ($scope.postError){
                $scope.postError($scope, error, headers);
              }
            }
          );
        };

        $scope.handleSuccess = function () {
          $scope.loading = false;

          $scope.resetForm();
          angular.copy($scope.resource, $scope.originalResource);
          toastr.success('Record ' + ($scope.resource.id ? 'updated' : 'saved'));
        };

        $scope.handleErrors = function (error) {
          toastr.error('Record failed to ' + ($scope.resource.id ? 'update' : 'save'));
          $scope.loading = false;

          if(error.data.error) {

            var attributes = error.data.error.attribute;

            angular.forEach(attributes, function(value, key) {
              $scope.detailsForm[key].$setValidity('api', false);
              $scope.detailsForm[key].$error = { api: value };
              $scope.detailsForm[key].$setTouched();
            });
          }
        };

        $scope.$watch('resource.id', function (newValue) {
          $scope.resetForm();

          if (newValue) {
            if ($scope.resource.createdBy !== '00000000-0000-0000-0000-000000000000') {
              $scope.creator = UserName.get($scope.resource.createdBy);
            }

            if ($scope.resource.updatedBy !== '00000000-0000-0000-0000-000000000000') {
              $scope.updater = UserName.get($scope.resource.updatedBy);
            }
          } else {
            delete $scope.creator;
            delete $scope.updater;
          }
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
      }
    };
  }]);
