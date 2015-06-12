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
          $scope.resource.save($scope.oResource,
            function (result) {
              $scope.resetForm();
              $scope.resource = result;
              $scope.oResource = angular.copy($scope.resource);
              toastr.success('Record ' + ($scope.resource.id ? 'updated' : 'saved'));
            },
            function (error){
              toastr.error('Record failed to ' + ($scope.resource.id ? 'update' : 'save'));
              console.log(error.data.error.attribute);
            }
          );
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
