'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['Alert', '$rootScope', '$window', 'DirtyForms',
    function (Alert, $rootScope, $window, DirtyForms) {
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

            var eventName = 'resource:details:' + ':' + ($scope.resource.isNew() ? 'create' : 'update');

            var successEventName = eventName + ':success',
              failureEventName = eventName + ':fail';

            return $scope.resource.save()
              .then($scope.handleSuccess, $scope.handleErrors)
              .then(function () {
                if (angular.isDefined(extSuccessEventName)) {
                  $rootScope.$broadcast(extSuccessEventName, $scope.resource);
                }

                $rootScope.$broadcast(successEventName, $scope.resource);
              }, function () {
                if (angular.isDefined(extFailureEventName)) {
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

          $scope.cancel = function () {
            DirtyForms.confirmIfDirty(function () {
              angular.copy($scope.originalResource, $scope.resource);
              $scope.resetForm();
              $scope.$emit('resource:details:' + $scope.resourceName + ':canceled');
            });
          };

          $scope.resetForm = function () {
            $scope.detailsForm.$setPristine();
            $scope.detailsForm.$setUntouched();
          };

          $scope.$on('resource:details:' + $scope.resourceName + ':cancel', function () {
            $scope.cancel();
          });
        }
      };
    }
  ]);