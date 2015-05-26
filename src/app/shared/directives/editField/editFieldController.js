'use strict';

angular.module('liveopsConfigPanel')

  .controller('EditFieldController', function ($scope) {

    $scope.saveHandler = function() {
      scope.$emit('editField:save', {
        objectId: $scope.objectId,
        fieldName: $scope.name,
        fieldValue: $scope.ngModel
      });
    };

    $scope.$on($scope.name + ':save', function() {
      scope.edit = false;
    });

  });

