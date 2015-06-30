'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['toastr', function(toastr) {
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
          $scope.newRecord = !$scope.originalResource || !$scope.originalResource.id;

          $scope.loading = true;

          if($scope.preSave){
            $scope.preSave($scope, $scope.newRecord);
          }

          $scope.resource.save(
            function (result) {
              if($scope.postSave){
                $scope.postSave($scope, result, $scope.newRecord);
              }

              $scope.handleSuccess(result);
            },

            function (error, headers){
              if ($scope.postError){
                $scope.postError($scope, error, headers, $scope.newRecord);
              }

              $scope.handleErrors(error);
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
        
        $scope.$on('resizehandle:resize', function(event, info){
          if (info.rightWidth > 700){
            $scope.twoCol = true;
          } else {
            $scope.twoCol = false;
          }
          
          if (info.rightWidth < 450){
            $scope.compactView = true;
          } else {
            $scope.compactView = false;
          }
        });
      }
    };
  }]);
