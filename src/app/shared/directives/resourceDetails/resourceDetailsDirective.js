'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['Alert', '$rootScope', '$window', function(Alert, $rootScope, $window) {
    return {
      restrict: 'E',
      scope: {
        originalResource: '=',
        headerTemplateUrl: '@',
        bodyTemplateUrl: '@',
        footerTemplateUrl: '@',
        extendScope: '=',
        resourceName: '@'
      },
      templateUrl: 'app/shared/directives/resourceDetails/resourceDetails.html',

      link: function ($scope, ele) {

        ele.addClass('details-pane');

        angular.extend($scope, $scope.extendScope);

        $scope.save = function (extSuccessEventName, extFailureEventName) {
          $scope.loading = true;

          var successEventName = $scope.resource.isNew() ?
            'resource:details:' + $scope.resourceName + ':create:success' :
            'resource:details:' + $scope.resourceName + ':update:success';

          var failureEventName = $scope.resource.isNew() ?
            'resource:details:' + $scope.resourceName + ':create:fail' :
            'resource:details:' + $scope.resourceName + ':update:fail';

          return $scope.resource.save()
            .then($scope.handleSuccess, $scope.handleErrors)
            .then(function () {
              if(angular.isDefined(extSuccessEventName)) {
                $rootScope.$broadcast(extSuccessEventName, $scope.resource);
              }

              $rootScope.$broadcast(successEventName, $scope.resource);
            }, function () {
              if(angular.isDefined(extFailureEventName)) {
                $rootScope.$broadcast(extFailureEventName, $scope.resource);
              }

              $rootScope.$broadcast(failureEventName, $scope.resource);
            }).finally(function () {
              $scope.loading = false;
            });
        };

        $scope.handleSuccess = function (resource) {
          $scope.resetForm();
          angular.copy($scope.resource, $scope.originalResource);
          Alert.success('Record ' + ($scope.resource.id ? 'updated' : 'saved'));
          return resource;
        };

        $scope.handleErrors = function (error) {
          Alert.error('Record failed to ' + ($scope.resource.id ? 'update' : 'save'));

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

        $scope.$on('resource:details:originalResource:changed', function () {
          $scope.resource = angular.copy($scope.originalResource);
        });

        $scope.cancel = function () {
          if ($scope.detailsForm.$dirty){
            Alert.confirm('You have unsaved changes that will be lost. Click OK to continue and discard your changes.', 
                function(){
                  angular.copy($scope.originalResource, $scope.resource);
                  $scope.resetForm();
                  $scope.$emit('resource:details:' + $scope.resourceName + ':canceled');
                },
                angular.noop
            );
          }
        };

        $scope.resetForm = function () {
          $scope.detailsForm.$setPristine();
          $scope.detailsForm.$setUntouched();
        };
        
        $scope.$on('resource:details:' + $scope.resourceName + ':cancel', function() {
          $scope.cancel();
        });
        
        $rootScope.$on('$stateChangeStart', function(event){
          if ($scope.detailsForm.$dirty){
            Alert.confirm('You have unsaved changes that will be lost. Click OK to continue, or click cancel to stay on this page.', 
                angular.noop, 
                function(){
                  event.preventDefault();
                }
            );
          }
        });
        
        $window.onbeforeunload = function(){
          if ($scope.detailsForm.$dirty){
            return 'You have unsaved changes that will be lost!';
          }
        };
      }
    };
  }]);
