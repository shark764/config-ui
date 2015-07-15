'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['Alert', '$rootScope', '$window', 'DirtyForms', '$q', '$location',
    function(Alert, $rootScope, $window, DirtyForms, $q, $location) {
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

        $scope.closeDetails = function () {
          $location.search({id : null});
          $scope.originalResource = null;
        };

        $scope.save = function (extSuccessEventName, extFailureEventName) {
          $scope.loading = true;

          var eventName = 'resource:details:' + $scope.resourceName + ':' + ($scope.resource.isNew() ? 'create' : 'update');

          var successEventName =  eventName + ':success',
              failureEventName = eventName + ':fail';

          return $scope.resource.save()
            .then($scope.handleSuccess, $scope.handleErrors)
            .then(function (result) {
              if(angular.isDefined(extSuccessEventName)) {
                $rootScope.$broadcast(extSuccessEventName, $scope.resource);
              }

              $rootScope.$broadcast(successEventName, $scope.resource);

              return result;

            }, function (error) {
              if(angular.isDefined(extFailureEventName)) {
                $rootScope.$broadcast(extFailureEventName, $scope.resource);
              }

              $rootScope.$broadcast(failureEventName, $scope.resource);

              return $q.reject(error);
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
          Alert.error('Record failed to ' + ($scope.resource.isNew() ? 'save' : 'update'));

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

          return $q.reject(error);
        };

        $scope.$watch('resource.id', function () {
          $scope.resetForm();
        });

        $scope.$watch('originalResource', function () {
          $scope.resource = angular.copy($scope.originalResource);
          $scope.resetForm();
        });

        $scope.$watch('originalResource', function () {
          $scope.resource = angular.copy($scope.originalResource);
        }, true); //TODO: Deep watch can be removed when group API returns members list

        $scope.cancel = function () {
          DirtyForms.confirmIfDirty(function(){
            $scope.$emit('resource:details:' + $scope.resourceName + ':canceled');

            if ($scope.resource.isNew() || ! $scope.detailsForm.$dirty){
              $scope.originalResource = null;
              $scope.resource = null;
            } else {
              angular.copy($scope.originalResource, $scope.resource);
              $scope.resetForm();
            }
          });
        };

        $scope.resetForm = function () {
          $scope.detailsForm.$setPristine();
          $scope.detailsForm.$setUntouched();
        };

        $scope.$on('resource:details:' + $scope.resourceName + ':cancel', function() {
          $scope.cancel();
        });
      }
    };
  }]);
