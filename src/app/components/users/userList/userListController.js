'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'Session', 'UserService', function ($scope, Session, UserService) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = 'Input required data';

    $scope.selectUser = function (user) {
      $scope.selectedUserContext = {
        user: user
      };

      $scope.selectedUserContext.display = {
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        state: user.state,
        created: user.created,
        createdBy: user.createdBy
      };
    };

    UserService.query(function (data) {
      $scope.users = data.result;
    });

    $scope.showModalSection = function () {
      $scope.showModal = true;
    };

    $scope.saveUser = function (data, userId) {
      userId = userId || null;

      if (!userId) { // if userId is null
        data.createdBy = Session.id;
        $scope.createUser(data);
      } else {
        data.updatedBy = Session.id;
        $scope.updateUser(userId, data);
      }
    };

    $scope.createUser = function (data) {
      UserService.save(data)
        .$promise.then(
          $scope.successResponse,
          $scope.errorResponse
        );
    };

    $scope.updateUser = function (userId, data) {
      return UserService.update({
          id: userId
        }, data)
        .$promise.then(
          $scope.successResponse,
          $scope.errorResponse
        );
    };

    $scope.successResponse = function () {
      $scope.showError = false;
      $scope.showModal = false;
    };

    $scope.errorResponse = function (data) {
      $scope.showError = true;
      $scope.errorMsg = data.statusText;
    };
  }]);