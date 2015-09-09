'use strict';

angular.module('liveopsConfigPanel')
  .directive('resourceDetails', ['Alert', '$rootScope', '$window', 'DirtyForms', '$q', '$location', 'Session',
    function(Alert, $rootScope, $window, DirtyForms, $q, $location, Session) {
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
        $scope.Session = Session;
        ele.addClass('details-pane');

        angular.extend($scope, $scope.extendScope);

        $scope.closeDetails = function () {
          DirtyForms.confirmIfDirty(function(){
            $location.search({id : null});
            $scope.originalResource = null;
          });
        };

        $scope.save = function () {
          $scope.loading = true;

          return $scope.resource.save()
            .then($scope.handleSuccess, $scope.handleErrors)
            .then(function (result) {
              return result;
            }, function (error) {
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
        }, true); //TODO: This deep watch can be removed when group API returns members list
        
        //Reference watch needed to catch when clicking "create" while already creating
        //Because all original resource's fields will be the same, but it will be a new object
        $scope.$watch('originalResource', function () {
          $scope.resource = angular.copy($scope.originalResource);
          $scope.resetForm();
        });

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
          //Workaround for fields with invalid text in them not being cleared when the model is updated to undefined
          //E.g. http://stackoverflow.com/questions/18874019/angularjs-set-the-model-to-be-again-doesnt-clear-out-input-type-url
          angular.forEach($scope.detailsForm, function (value, key) {
            if (value && value.hasOwnProperty('$modelValue') && value.$invalid){
              var displayValue = value.$modelValue;
              if (displayValue === null){
                displayValue = undefined;
              }
              
              $scope.detailsForm[key].$setViewValue(displayValue);
              $scope.detailsForm[key].$rollbackViewValue();
            }
          });
          
          $scope.detailsForm.$setPristine();
          $scope.detailsForm.$setUntouched();
        };

        $scope.$on('resource:details:' + $scope.resourceName + ':cancel', function() {
          $scope.cancel();
        });
      }
    };
  }]);
