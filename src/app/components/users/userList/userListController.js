'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'Session', 'UserService', function ($scope, Session, UserService) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = 'Input required data';

    $scope.$on('userTable:user:selected', function (event, selectedUser) {
      $scope.selectedUser = selectedUser;
      $scope.$broadcast('userList:user:selected', selectedUser);
    });

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
        $scope.createUser(data)
          .then(
            $scope.successResponse,
            $scope.errorResponse);
      } else {
        data.updatedBy = Session.id;
        $scope.updateUser(userId, data)
          .then(
            $scope.successResponse,
            $scope.errorResponse);
      }
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
    };

    $scope.errorResponse = function (data) {
      $scope.showError = true;
      $scope.errorMsg = data.data.message;
    };

    $scope.$on('editField:save', function (event, args) {
      var saveObject = {};
      saveObject.updatedBy = '1c838030-f772-11e4-ac37-45b2e1245d4b';
      saveObject[args.fieldName] = args.fieldValue;

      $scope.updateUser(args.objectId, saveObject)
        .then(function (data) {
          $scope.$broadcast('userList:' + args.fieldName + ':save', data);
        }, function (data) {
          $scope.$broadcast('userList:' + args.fieldName + ':save:error', data);
        });
    });
  }]);