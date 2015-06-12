'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['UserName', 'toastr', function(UserName, toastr) {
    return {
      restrict: 'AE',
      scope : {
        resource: '=',
        headerTemplateUrl: '@',
        bodyTemplateUrl: '@',
        extendScope: '='
      },
      templateUrl : 'app/shared/directives/resourceDetails/resourceDetails.html',

      link : function($scope) {
        angular.extend($scope, $scope.extendScope);
        $scope.oResource = angular.copy($scope.resource);

        $scope.save = function () {
          $scope.loading = true;
          if($scope.preSave){
            $scope.preSave($scope);
          }

          $scope.resource.save($scope.oResource,

            function (result) {
              $scope.loading = false;
              $scope.resetForm();
              $scope.resource = result;
              $scope.oResource = angular.copy($scope.resource);
              toastr.success('Record ' + ($scope.resource.id ? 'updated' : 'saved'));
            },

            function (error){
              $scope.loading = false;

              toastr.error('Record failed to ' + ($scope.resource.id ? 'update' : 'save'));

              var attributes = error.data.error.attribute;

              angular.forEach(attributes, function(value, key) {
                $scope.detailsForm[key].$setValidity("api", false);
                $scope.detailsForm[key].$error = {api : value};
                $scope.detailsForm[key].$setTouched();
              });
            }
          );
          
          if($scope.postSave){
            $scope.postSave($scope);
          }
        };

        $scope.$watch('resource.id', function(newValue){
          $scope.resetForm();

          if (newValue){
            $scope.creator = UserName.get($scope.resource.createdBy);
            $scope.updater = UserName.get($scope.resource.updatedBy);
          } else {
            delete $scope.creator;
            delete $scope.updater;
          }
        })

        $scope.$watch('resource', function () {
          $scope.oResource = angular.copy($scope.resource);
        });

        $scope.cancel = function () {
          angular.copy($scope.oResource, $scope.resource);
          $scope.resetForm();
        };

        $scope.resetForm = function(){
          $scope.detailsForm.$setPristine();
          $scope.detailsForm.$setUntouched();
        }
      }
    };
   }]);
