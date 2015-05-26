'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'Session', 'UserService', function ($scope, Session, UserService) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = 'Input required data';

    $scope.$on('userTable:user:selected', function (event, selectedUser) {
      $scope.selectedUser = selectedUser;
    });

    UserService.query(function (data) {
      $scope.users = data.result;
    });

    $scope.showModalSection = function () {
      $scope.showModal = true;
    };

    $scope.createUser = function (data) {
      return UserService.save(data).$promise;
    };

    $scope.updateUser = function (userId, data) {
      return UserService.update({
        id: userId
      }, data).$promise;
    };

    $scope.successResponse = function () {
      $scope.showError = false;
      $scope.showModal = false;
      UserService.query(function (data) {
        $scope.users = data.result;
      });
    };

    $scope.errorResponse = function (data) {
      $scope.showError = true;
      $scope.errorMsg = data.data.message;
    };

    $scope.$on('editField:save', function (event, args) {
      var saveObject = {};
      saveObject[args.fieldName] = args.fieldValue;

      $scope.updateUser(args.objectId, saveObject)
        .then(function (data) {
          $scope.$broadcast(args.fieldName + ':save', data);
        }, function (data) {
          $scope.$broadcast(args.fieldName + ':save:error', data);
        });
    });

    $scope.$on('createUser:save', function (event, args) {
      $scope.createUser(args.data)
        .then(
          $scope.successResponse,
          $scope.errorResponse
        );
    });

  }]);
