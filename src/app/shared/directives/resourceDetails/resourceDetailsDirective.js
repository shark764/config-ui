'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['User', function(User) {
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
          $scope.resource.save({id: $scope.resource.id, tenantId: $scope.resource.tenantId, regionId: $scope.resource.regionId},
            function (result) {
              $scope.resetForm();
              $scope.resource = result;
              $scope.oResource = angular.copy($scope.resource);
            }
          );
        };

        $scope.$watch('resource.id', function(newValue){
          $scope.resetForm();
          
          if (newValue){
            $scope.creator = User.get({id : $scope.resource.createdBy});
          } else {
            delete $scope.creator;
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
